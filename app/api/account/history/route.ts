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
    const { scans } = await import("@/lib/db/schema");
    const { eq, desc } = await import("drizzle-orm");

    const userScans = await db.query.scans.findMany({
      where: eq(scans.userId, userId),
      orderBy: desc(scans.createdAt),
      limit: 50,
    });

    return NextResponse.json(userScans);
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Database is not available in this environment." },
      { status: 503 }
    );
  }
}
