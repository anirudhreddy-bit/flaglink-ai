import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a legal expert analyzing Terms & Conditions for potential risks. 
Analyze the document thoroughly and return ONLY valid JSON with this exact shape:
{
  "riskLevel": "green" | "yellow" | "red",
  "score": number (0-100, where 0=completely safe, 100=extremely risky),
  "redFlags": [{ "clause": string, "explanation": string, "severity": "low"|"medium"|"high" }],
  "advice": string[]
}

Scoring guidelines:
- 0-20: Minimal risk (green) - Few or no concerning clauses
- 21-50: Moderate risk (yellow) - Some concerning terms that warrant caution
- 51-100: High risk (red) - Multiple serious issues or very aggressive terms

Look for these major red flags:
1. Auto-renewal traps (hard to cancel, automatic charges)
2. Forced arbitration (no right to sue, disputes go to arbitration)
3. Data selling or sharing (selling/sharing personal data with third parties)
4. IP grabs (claiming rights to user-generated content)
5. Unilateral changes (company can change terms without consent)
6. Asymmetric liability (company not liable but you are)
7. Behavior/keystroke logging (monitoring user activity)
8. Consent-by-use (agreeing just by using the service)
9. Vague language (unclear terms that could be interpreted broadly)
10. One-sided termination (company can terminate without cause)

Severity levels:
- HIGH: Serious issues that pose significant risk (auto-renewal without clear cancellation, forced arbitration, unlimited liability on user)
- MEDIUM: Concerning but less severe (data sharing with partners, basic monitoring, unilateral changes with notice)
- LOW: Minor issues (long paragraphs, minor unclear language, standard limitations)

Return ONLY the JSON object. No markdown, no code fences, no explanation.`;

function isUrl(input: string): boolean {
  try {
    const u = new URL(input.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
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

async function fetchPageText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; FlagLinkAI/1.0; +https://flaglink.ai)",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
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
    const buffer = Buffer.from(arrayBuffer);
    // Import at call-site to avoid Next.js build issues with pdf-parse test files
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse/lib/pdf-parse.js");
    const parsed = await pdfParse(buffer);
    return { text: parsed.text, name };
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
          { error: "Please provide a URL, text, or file to analyze." },
          { status: 400 }
        );
      }

      let textToAnalyze: string;
      if (isUrl(input.trim())) {
        try {
          textToAnalyze = await fetchPageText(input.trim());
        } catch {
          return NextResponse.json(
            { error: "Could not fetch the URL. Please check it's accessible or paste the text directly." },
            { status: 400 }
          );
        }
      } else {
        textToAnalyze = input.trim();
      }

      if (textToAnalyze.length > 100000) textToAnalyze = textToAnalyze.slice(0, 100000);
      if (textToAnalyze.length < 50) {
        return NextResponse.json(
          { error: "The text seems too short to be Terms & Conditions. Please provide more content." },
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

    // Parse the JSON response from Claude
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      // Try to extract JSON from the response if Claude wrapped it
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Claude response as JSON");
      }
    }

    // Validate the response shape
    if (
      !result.riskLevel ||
      typeof result.score !== "number" ||
      !Array.isArray(result.redFlags) ||
      !Array.isArray(result.advice)
    ) {
      throw new Error("Invalid response shape from Claude");
    }

    // Ensure score is in valid range (0-100)
    if (result.score < 0 || result.score > 100) {
      // Calculate score based on red flags if it's out of range
      const highCount = result.redFlags.filter((f: any) => f.severity === "high").length;
      const mediumCount = result.redFlags.filter((f: any) => f.severity === "medium").length;
      const lowCount = result.redFlags.filter((f: any) => f.severity === "low").length;
      
      // Score calculation: high flags worth more, medium medium, low low
      result.score = Math.min(100, (highCount * 35) + (mediumCount * 15) + (lowCount * 5));
    }

    // Validate and correct riskLevel based on score
    if (result.score <= 20) {
      result.riskLevel = "green";
    } else if (result.score <= 50) {
      result.riskLevel = "yellow";
    } else {
      result.riskLevel = "red";
    }

    // Save scan to database if user is authenticated
    if (userId) {
      try {
        const { db } = await import("@/lib/db");
        const { scans } = await import("@/lib/db/schema");
        await db.insert(scans).values({
          userId,
          input: uploadedFileName ? `[file] ${uploadedFileName}` : input.trim(),
          website: uploadedFileName ?? extractWebsiteName(input.trim()),
          riskLevel: result.riskLevel,
          score: result.score,
          redFlags: result.redFlags,
          advice: result.advice,
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
