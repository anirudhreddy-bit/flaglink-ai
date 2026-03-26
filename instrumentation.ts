/** Runs once per Node server process — applies DB migrations before handling traffic. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { ensureUserBillingSchema } = await import("@/lib/db");
    await ensureUserBillingSchema();
  } catch (e) {
    console.warn("[instrumentation] ensureUserBillingSchema:", e);
  }
}
