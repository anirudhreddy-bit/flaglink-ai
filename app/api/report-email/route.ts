import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Resend } from "resend";
import { userHasProPlan } from "@/lib/user-pro-plan";
import { buildReportPdfBytes, type ReportPdfInput } from "@/lib/build-report-pdf";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeFilenamePart(s: string): string {
  return s.replace(/[^\w.-]+/g, "_").slice(0, 48) || "report";
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
        { error: "Sending reports by email is a Pro feature." },
        { status: 403 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.FLAGLINK_REPORT_FROM?.trim();
    if (!apiKey || !from) {
      return NextResponse.json(
        {
          error:
            "Email is not configured. Add RESEND_API_KEY and FLAGLINK_REPORT_FROM to the server environment (see .env.example).",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const to = typeof body.to === "string" ? body.to.trim() : "";
    const report = body.report as ReportPdfInput | undefined;

    if (!to || !EMAIL_RE.test(to)) {
      return NextResponse.json({ error: "Enter a valid recipient email address." }, { status: 400 });
    }
    if (!report || typeof report.domain !== "string") {
      return NextResponse.json({ error: "Missing report data." }, { status: 400 });
    }

    const normalized: ReportPdfInput = {
      domain: report.domain,
      score: typeof report.score === "number" ? report.score : null,
      verdict: report.verdict ?? null,
      summary: report.summary ?? null,
      flags: Array.isArray(report.flags)
        ? report.flags.map((f) => ({
            title: String(f?.title ?? ""),
            description: String(f?.description ?? ""),
            severity: String(f?.severity ?? "medium"),
            quote: String(f?.quote ?? ""),
          }))
        : [],
    };

    const pdfBytes = await buildReportPdfBytes(normalized);
    const filename = `flaglink-report-${safeFilenamePart(normalized.domain)}.pdf`;

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: `FlagLink AI report: ${normalized.domain}`,
      html: `<p>Your FlagLink AI terms &amp; conditions report for <strong>${escapeHtml(normalized.domain)}</strong> is attached as a PDF.</p>
<p style="color:#64748b;font-size:13px;">This analysis is informational only and is not legal advice.</p>`,
      attachments: [
        {
          filename,
          content: Buffer.from(pdfBytes),
        },
      ],
    });

    if (error) {
      console.error("[report-email] Resend:", error);
      return NextResponse.json(
        { error: typeof error.message === "string" ? error.message : "Could not send email." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (e) {
    console.error("[report-email]", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
