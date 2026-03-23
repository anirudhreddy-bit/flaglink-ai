import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.id as string;

    const { db } = await import("@/lib/db");
    const { users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      name: user.name ?? "",
      email: user.email ?? "",
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
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
