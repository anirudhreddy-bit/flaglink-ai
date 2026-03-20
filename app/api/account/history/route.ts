import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { db } = await import("@/lib/db");
    const { scans } = await import("@/lib/db/schema");
    const { eq, desc } = await import("drizzle-orm");

    const userScans = await db.query.scans.findMany({
      where: eq(scans.userId, session.user.id),
      orderBy: desc(scans.createdAt),
      limit: 50,
    });

    return NextResponse.json(userScans);
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Database is not available in this environment. History requires a persistent database." },
      { status: 503 }
    );
  }
}
