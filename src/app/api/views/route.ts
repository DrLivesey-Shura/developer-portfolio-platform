// src/app/api/views/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Make sure you have this import
import { connectToDatabase } from "@/lib/db/connect";
import { PageView } from "@/lib/db/models/PageView";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user ID from your session
    // Adjust this based on how your session stores the user ID
    const userId = session.user.id || (session.user as any).userId;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const { targetId, targetType } = await req.json();
    const visitorId = req.headers.get("x-visitor-id") || "anonymous";

    // Prevent duplicate views from the same visitor within a time window
    const recentView = await PageView.findOne({
      targetId,
      visitorId,
      viewedAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }, // 30 minutes
    });

    if (recentView) {
      return NextResponse.json({ message: "View already recorded" });
    }

    const pageView = new PageView({
      userId,
      targetId,
      targetType,
      visitorId,
      referrer: req.headers.get("referer"),
      userAgent: req.headers.get("user-agent"),
      viewedAt: new Date(),
    });

    await pageView.save();
    return NextResponse.json({ message: "View recorded successfully" });
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json(
      { error: "Failed to record view" },
      { status: 500 }
    );
  }
}
