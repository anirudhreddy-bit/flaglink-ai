import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Anthropic from "@anthropic-ai/sdk";
import { userHasProPlan } from "@/lib/user-pro-plan";

interface Flag {
  id: string;
  title: string;
  description: string;
  severity: string;
  quote: string;
}

interface AdviceTip {
  flag_id: string;
  tip: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ReportContext {
  domain: string;
  score: number | null;
  verdict: string | null;
  summary?: string | null;
  flags: Flag[];
  advice: AdviceTip[];
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await userHasProPlan(token.id as string))) {
      return NextResponse.json(
        { error: "Report assistant is a Pro feature. Upgrade to ask follow-up questions." },
        { status: 403 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key." }, { status: 500 });
    }

    const body = await request.json();
    const { messages, reportContext }: { messages: ChatMessage[]; reportContext: ReportContext } = body;

    if (!messages?.length || !reportContext) {
      return NextResponse.json({ error: "Missing messages or report context." }, { status: 400 });
    }

    const flagsSummary = reportContext.flags
      .map((f, i) => `${i + 1}. [${f.severity.toUpperCase()}] ${f.title}: ${f.description}${f.quote ? ` (quote: "${f.quote}")` : ""}`)
      .join("\n");

    const adviceSummary = reportContext.advice
      .map((a, i) => `${i + 1}. [${a.flag_id}] ${a.tip}`)
      .join("\n");

    const summaryBlock = reportContext.summary
      ? `Plain-English summary: ${reportContext.summary}\n\n`
      : "";

    const systemPrompt = `You are FlagLink AI's report assistant — a focused agent that answers follow-up questions ONLY about the scan report below. The user already saw the full results; help them go deeper (clarify flags, compare severities, explain tradeoffs, suggest practical next steps). Answer in plain English — no legalese, no fluff.

REPORT CONTEXT
==============
Document: ${reportContext.domain}
Risk Score: ${reportContext.score ?? "N/A"}/100
Verdict: ${reportContext.verdict ?? "Analyzed"}

${summaryBlock}FLAGS FOUND (${reportContext.flags.length} total):
${flagsSummary || "None found."}

RECOMMENDED ACTIONS:
${adviceSummary || "None provided."}
==============

Rules:
- Be concise (2–5 sentences unless the user asks for depth)
- Tie answers to this report (flag titles, advice tips, quotes when useful)
- If asked something outside this report, say you only have this document's analysis
- You are not a lawyer — no formal legal advice; stay practical and informational
- Friendly, conversational tone`;

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Report chat error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
