import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { oldPassword, newPassword, action } = body;

    if (action === "verify-old-password") {
      if (!oldPassword) {
        return NextResponse.json(
          { error: "Old password is required" },
          { status: 400 }
        );
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
      });

      if (!user || !user.password) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      return NextResponse.json({ verified: true });
    }

    if (action === "reset-password") {
      if (!newPassword) {
        return NextResponse.json(
          { error: "New password is required" },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, session.user.id));

      return NextResponse.json({ message: "Password updated successfully" });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "An error occurred while resetting password" },
      { status: 500 }
    );
  }
}
