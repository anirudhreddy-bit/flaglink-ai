import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are FlagLink AI — an expert legal clause analyst specialized in consumer Terms & Conditions, Privacy Policies, SaaS agreements, and subscription contracts.

Your job is to protect regular people from hidden traps in legal documents they don't have time to read. You explain everything in plain English — no legal jargon. You are not a lawyer and must never give legal advice. You are an AI analysis tool.

══════════════════════════════════════════
YOUR IDENTITY & RULES
══════════════════════════════════════════
- Always be direct, clear, and on the user's side
- Never use legal jargon — explain like talking to a smart friend
- Never say "consult a lawyer" as your main advice (it's unhelpful)
- Always return ONLY valid JSON — no markdown, no preamble, no explanation outside the JSON
- If the input is not a T&C document, return an error JSON
- If the document is unusually fair/safe, say so honestly

══════════════════════════════════════════
RED FLAG DICTIONARY
══════════════════════════════════════════
You must check for ALL of the following clause types.
For each one found, create a flag entry in your response.

CRITICAL SEVERITY (score: 25 points each):
1. FORCED_ARBITRATION — "binding arbitration", "waive right to jury trial", "AAA rules", "JAMS arbitration"
2. CLASS_ACTION_WAIVER — "waive right to class action", "individual basis only", "no class arbitration"
3. UNILATERAL_TERM_CHANGES — "reserve the right to modify", "at any time without notice", "continued use constitutes acceptance"
4. BROAD_IP_OWNERSHIP — "royalty-free license", "perpetual irrevocable license", "worldwide license to use", "feedback becomes property of"

HIGH SEVERITY (score: 15 points each):
5. DATA_SOLD_TO_THIRD_PARTIES — "share with partners", "third-party advertisers", "data partners", "marketing purposes"
6. HIDDEN_AUTO_RENEWAL — "automatically renew", "until cancelled", "no refund after renewal", "cancel before renewal date"
7. ASYMMETRIC_INDEMNIFICATION — "you agree to indemnify", "hold harmless", "defend us against claims arising from your use"
8. EXCESSIVE_DATA_COLLECTION — "keystroke logging", "screen recording", "precise location", "contacts", "microphone access", "camera access"
9. NO_LIABILITY_CLAUSE — "not liable for any damages", "to the fullest extent permitted by law", "disclaim all warranties"

MEDIUM SEVERITY (score: 8 points each):
10. CONSENT_BY_USE — "by accessing or using", "by continuing to use", "deemed to have accepted"
11. VAGUE_TERMINATION — "at our sole discretion", "terminate at any time", "without notice or liability", "for any reason"
12. NO_CONTACT_INFORMATION — absence of physical address, generic contact forms only
13. GOVERNING_LAW_TRAP — "courts of [specific state/country]", "exclusive jurisdiction", "venue shall be"

LOW SEVERITY (score: 3 points each):
14. PLACEHOLDER_LANGUAGE — "[Company Name]", "[DATE]", "Lorem ipsum", template-style placeholder text
15. BROAD_LICENSE_TO_USER_CONTENT — "license to display, reproduce, distribute", "use your content for promotional purposes"

══════════════════════════════════════════
SCORING RULES — follow exactly
══════════════════════════════════════════
Start at 0. Add points for each flag found:
  Critical flag found: +25 points
  High flag found:     +15 points
  Medium flag found:   +8 points
  Low flag found:      +3 points
Cap final score at 100.

Verdict based on score:
  0–30:   "Low Risk"      — generally safe to sign
  31–55:  "Medium Risk"   — proceed with caution
  56–79:  "High Risk"     — significant concerns
  80–100: "Critical Risk" — strongly consider alternatives

riskLevel mapping (include this for backward compat):
  "Low Risk"      → "green"
  "Medium Risk"   → "yellow"
  "High Risk"     → "red"
  "Critical Risk" → "red"

══════════════════════════════════════════
ADVICE RULES
══════════════════════════════════════════
For each HIGH or CRITICAL flag found, generate one specific, actionable piece of advice.
Good: "Set a calendar reminder 3 days before your renewal date with a link to their cancellation page."
Bad: "Consult a lawyer." / "Read the terms carefully." / "Be aware of this clause."

══════════════════════════════════════════
OUTPUT FORMAT — return this exact JSON, nothing else
══════════════════════════════════════════
{
  "domain": "string — domain name or 'Pasted Text'",
  "score": number,
  "verdict": "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk",
  "riskLevel": "green" | "yellow" | "red",
  "summary": "string — 2 sentence plain English summary of the overall document",
  "flags": [
    {
      "id": "string — flag type e.g. FORCED_ARBITRATION",
      "title": "string — short plain English title",
      "description": "string — plain English explanation of what this means for the user",
      "severity": "critical" | "high" | "medium" | "low",
      "quote": "string — exact quote from the document that triggered this flag, max 100 chars"
    }
  ],
  "advice": [
    {
      "flag_id": "string — which flag this advice relates to",
      "tip": "string — specific actionable advice, plain English"
    }
  ],
  "safe_clauses": ["string — 1-3 things the document does well or fairly"],
  "error": null
}

If input is NOT a valid T&C document, return:
{
  "domain": null, "score": null, "verdict": null, "riskLevel": null,
  "summary": null, "flags": [], "advice": [], "safe_clauses": [],
  "error": "This doesn't appear to be a Terms & Conditions or Privacy Policy document. Please paste the full text or a direct URL to a T&C page."
}

Return ONLY the JSON object. No markdown, no code fences, no explanation.`;

function isUrl(input: string): boolean {
  try {
    const u = new URL(input.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** e.g. `spotify.com/legal` → `https://spotify.com/legal` for fetching */
function resolveUrlCandidate(raw: string): string {
  const t = raw.trim();
  if (isUrl(t)) return t;
  if (!t || /\s/.test(t) || t.includes("://")) return t;
  if (!/^[\w.-]+\.[a-z]{2,}([/?#][^\s]*)?$/i.test(t)) return t;
  try {
    return new URL(t.startsWith("//") ? `https:${t}` : `https://${t}`).href;
  } catch {
    return t;
  }
}

function extractWebsiteName(input: string): string {
  if (isUrl(input.trim())) {
    try {
      const url = new URL(input.trim());
      return url.hostname.replace("www.", "");
    } catch {
      return "Unknown";
    }
  }
  return "Pasted Text";
}

/** Many sites block non-browser clients. Omit Sec-Fetch-* (those describe real browser navigations and can trip some WAFs). */
const FETCH_PAGE_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  DNT: "1",
  "Upgrade-Insecure-Requests": "1",
};

async function fetchPageText(url: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: FETCH_PAGE_HEADERS,
      signal: AbortSignal.timeout(30_000),
    });
  } catch (e) {
    const name = e instanceof Error ? e.name : "";
    if (name === "AbortError" || name === "TimeoutError") {
      throw new Error("timeout");
    }
    throw e;
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const html = await res.text();

  // Strip HTML tags and collapse whitespace to get readable text
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

async function extractTextFromFile(file: File): Promise<{ text: string; name: string }> {
  const name = file.name.replace(/\.[^.]+$/, ""); // strip extension
  const ext  = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "txt") {
    const text = await file.text();
    return { text, name };
  }

  if (ext === "pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const { extractText } = await import("unpdf");
    const pages = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
    const text = Array.isArray(pages) ? pages.join("\n") : String(pages);
    return { text, name };
  }

  if (ext === "docx") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value, name };
  }

  throw new Error("Unsupported file type. Please upload a .txt, .pdf, or .docx file.");
}

export async function POST(request: NextRequest) {
  try {
    // Read JWT directly from request cookie — works reliably in App Router
    let userId: string | null = null;
    try {
      const { getToken } = await import("next-auth/jwt");
      const token = await getToken({ req: request });
      userId = (token?.id as string) ?? null;
    } catch {
      // auth unavailable (e.g. serverless without DB)
    }

    const contentType = request.headers.get("content-type") ?? "";
    let input  = "";
    let uploadedFileName: string | null = null;
    /** True when we read text from a non-image upload (PDF/DOCX/TXT), for clearer 400 messages. */
    let hadTextFileUpload = false;
    let imageBase64: string | null = null;
    let imageMediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" | null = null;

    const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/heic"];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file || file.size === 0) {
        return NextResponse.json({ error: "No file received." }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large. Maximum size is 10 MB." }, { status: 400 });
      }

      uploadedFileName = file.name.replace(/\.[^.]+$/, "");

      if (IMAGE_TYPES.includes(file.type.toLowerCase())) {
        // Vision path — send image directly to Claude
        const buffer = Buffer.from(await file.arrayBuffer());
        imageBase64 = buffer.toString("base64");
        // Normalise heic → jpeg for Claude
        const mt = file.type.toLowerCase().replace("image/heic", "image/jpeg").replace("image/jpg", "image/jpeg");
        imageMediaType = mt as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
      } else {
        // Text-extraction path (PDF / DOCX / TXT)
        hadTextFileUpload = true;
        try {
          const extracted = await extractTextFromFile(file);
          input = extracted.text;
        } catch (e: unknown) {
          return NextResponse.json(
            { error: e instanceof Error ? e.message : "Could not read file." },
            { status: 400 }
          );
        }
      }
    } else {
      const body = await request.json();
      input = body.input ?? "";
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: Missing API key." },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });
    let message: Awaited<ReturnType<typeof anthropic.messages.create>>;

    if (imageBase64 && imageMediaType) {
      // ── Vision path ──────────────────────────────────────────────────────
      message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: imageMediaType, data: imageBase64 },
            },
            {
              type: "text",
              text: "This image contains Terms & Conditions or a legal document. Read every visible word in the image and analyze it as specified. Return ONLY the JSON.",
            },
          ],
        }],
      });
    } else {
      // ── Text path ────────────────────────────────────────────────────────
      if (!input || input.trim().length === 0) {
        return NextResponse.json(
          {
            error: hadTextFileUpload
              ? "No readable text was extracted from this file. Scanned PDFs and some exports have no text layer — try a .txt/.docx export, upload a clear photo of the document, or paste the text."
              : "Please provide a URL, text, or file to analyze.",
          },
          { status: 400 }
        );
      }

      const trimmedInput = input.trim();
      const urlForFetch = resolveUrlCandidate(trimmedInput);

      let textToAnalyze: string;
      if (isUrl(urlForFetch)) {
        try {
          textToAnalyze = await fetchPageText(urlForFetch);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "";
          let detail =
            "Could not fetch the URL. The site may still block server requests, require login, or load terms only in the browser. Open the page, copy the terms, and paste them here.";
          if (msg === "timeout") {
            detail =
              "Fetching that URL timed out (30s). The site may be slow or blocking our servers — copy the terms from your browser and paste them here.";
          } else if (msg.startsWith("HTTP ")) {
            detail = `The URL returned ${msg}. If the page works in your browser, copy the terms text and paste it here.`;
          }
          return NextResponse.json({ error: detail }, { status: 400 });
        }
      } else {
        textToAnalyze = trimmedInput;
      }

      if (textToAnalyze.length > 100000) textToAnalyze = textToAnalyze.slice(0, 100000);
      if (textToAnalyze.length < 50) {
        return NextResponse.json(
          {
            error: hadTextFileUpload
              ? `Only ${textToAnalyze.length} characters were extracted from this file — not enough to analyze. For image-based or scanned PDFs, upload a photo instead, or paste the full text.`
              : isUrl(urlForFetch)
                ? "We could only get a very small amount of text from that URL (the page may be mostly images or loaded dynamically). Copy the terms from your browser and paste them here."
                : "The text seems too short to be Terms & Conditions. Please paste more content (at least a few sentences).",
          },
          { status: 400 }
        );
      }

      message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Analyze these Terms & Conditions:\n\n${textToAnalyze}` }],
      });
    }

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse Claude's response
    let result: Record<string, unknown>;
    try {
      result = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Claude response as JSON");
      }
    }

    // If Claude flagged a non-T&C document, return the error payload as-is
    if (result.error) {
      return NextResponse.json(result);
    }

    // Validate required new-format fields
    if (
      typeof result.score !== "number" ||
      !result.verdict ||
      !Array.isArray(result.flags) ||
      !Array.isArray(result.advice)
    ) {
      throw new Error("Invalid response shape from Claude");
    }

    // Cap score
    result.score = Math.min(100, Math.max(0, result.score as number));

    // Derive / correct riskLevel from score (keep for DB compat)
    const score = result.score as number;
    if (score <= 30)      result.riskLevel = "green";
    else if (score <= 55) result.riskLevel = "yellow";
    else                  result.riskLevel = "red";

    // Derive verdict from score (authoritative)
    if (score <= 30)      result.verdict = "Low Risk";
    else if (score <= 55) result.verdict = "Medium Risk";
    else if (score <= 79) result.verdict = "High Risk";
    else                  result.verdict = "Critical Risk";

    // Ensure safe_clauses exists
    if (!Array.isArray(result.safe_clauses)) result.safe_clauses = [];

    // Save to DB — map new shape to existing schema columns
    if (userId) {
      try {
        const { db } = await import("@/lib/db");
        const { scans } = await import("@/lib/db/schema");

        // Flatten flags → redFlags format for DB compat
        const redFlagsForDb = (result.flags as Array<Record<string, unknown>>).map((f) => ({
          clause: f.title as string,
          explanation: f.description as string,
          severity: f.severity as string,
        }));
        // Flatten advice → string array for DB compat
        const adviceForDb = (result.advice as Array<Record<string, unknown>>).map((a) => a.tip as string);

        await db.insert(scans).values({
          userId,
          input: uploadedFileName ? `[file] ${uploadedFileName}` : input.trim(),
          website: (result.domain as string | null) ?? uploadedFileName ?? extractWebsiteName(input.trim()),
          riskLevel: result.riskLevel as "green" | "yellow" | "red",
          score: result.score as number,
          redFlags: redFlagsForDb,
          advice: adviceForDb,
        });
      } catch (dbError) {
        console.error("Failed to save scan:", dbError);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scan error:", error);

    return NextResponse.json(
      { error: "An error occurred while analyzing the content. Please try again." },
      { status: 500 }
    );
  }
}
