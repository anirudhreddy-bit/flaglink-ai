/**
 * App creator / lifetime full access by account email (case-insensitive).
 * Add more via comma-separated FLAGLINK_CREATOR_EMAILS in env without code changes.
 */
const BUILTIN_CREATOR_EMAILS = ["flaglink@gmail.com"];

function extraCreatorEmails(): string[] {
  const raw = process.env.FLAGLINK_CREATOR_EMAILS;
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isCreatorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  if (BUILTIN_CREATOR_EMAILS.includes(e)) return true;
  return extraCreatorEmails().includes(e);
}
