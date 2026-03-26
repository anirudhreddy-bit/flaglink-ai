import { eq } from "drizzle-orm";
import { isCreatorEmail } from "@/lib/creator";
import { db, userTableHasPlanColumn } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function userHasProPlan(userId: string): Promise<boolean> {
  const base = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (isCreatorEmail(base[0]?.email)) return true;

  if (!(await userTableHasPlanColumn())) return false;
  const rows = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0]?.plan === "pro";
}
