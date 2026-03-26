import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isCreatorEmail } from "@/lib/creator";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.id as string;

    const { db, userTableHasPlanColumn } = await import("@/lib/db");
    const { users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const baseRows = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const row = baseRows[0];
    if (!row) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let plan: "free" | "pro" = "free";
    if (await userTableHasPlanColumn()) {
      const planRows = await db
        .select({ plan: users.plan })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      const p = planRows[0]?.plan;
      if (p === "pro" || p === "free") plan = p;
    }

    if (isCreatorEmail(row.email)) plan = "pro";

    return NextResponse.json({
      name: row.name ?? "",
      email: row.email ?? "",
      plan,
    });
  } catch (e) {
    console.error("Profile GET failed:", e);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.id as string;

    const body = await request.json();
    const { firstName, lastName, email } = body;

    const name = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ");

    const { db } = await import("@/lib/db");
    const { users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    await db.update(users)
      .set({ name: name || null, email: email?.trim() || undefined })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
