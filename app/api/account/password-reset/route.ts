import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
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
    const { oldPassword, newPassword, action } = body;

    const { db } = await import("@/lib/db");
    const { users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");
    const bcrypt = (await import("bcryptjs")).default;

    if (action === "verify-old-password") {
      if (!oldPassword) {
        return NextResponse.json({ error: "Old password is required" }, { status: 400 });
      }

      const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

      if (!user || !user.password) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }

      return NextResponse.json({ verified: true });
    }

    if (action === "reset-password") {
      if (!newPassword) {
        return NextResponse.json({ error: "New password is required" }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));

      return NextResponse.json({ message: "Password updated successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Database is not available in this environment." },
      { status: 503 }
    );
  }
}
