// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/connect";
import { PageView } from "@/lib/db/models/PageView";
import Project from "@/lib/db/models/project";
import Post from "@/lib/db/models/post";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user ID from your session
    const userId = session.user.id || (session.user as any).userId;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    // Get date ranges for trends
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const twoMonthsAgo = new Date(oneMonthAgo);
    twoMonthsAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const twoWeeksAgo = new Date(oneWeekAgo);
    twoWeeksAgo.setDate(oneWeekAgo.getDate() - 7);

    // Parallel queries for better performance
    const [
      currentMonthViews,
      previousMonthViews,
      currentWeekProfileViews,
      previousWeekProfileViews,
      totalProjects,
      totalPosts,
    ] = await Promise.all([
      // Total views this month
      PageView.countDocuments({
        userId,
        targetType: "post",
        viewedAt: { $gte: oneMonthAgo },
      }),
      // Total views previous month
      PageView.countDocuments({
        userId,
        targetType: "post",
        viewedAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo },
      }),
      // Profile views this week
      PageView.countDocuments({
        userId,
        targetType: "profile",
        viewedAt: { $gte: oneWeekAgo },
      }),
      // Profile views previous week
      PageView.countDocuments({
        userId,
        targetType: "profile",
        viewedAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
      }),
      // Total projects
      Project.countDocuments({ userId }),
      // Total published posts
      Post.countDocuments({ userId, status: "published" }),
    ]);

    // Calculate trends (percentage change)
    const viewsTrend =
      previousMonthViews === 0
        ? 100
        : ((currentMonthViews - previousMonthViews) / previousMonthViews) * 100;

    const profileViewsTrend =
      previousWeekProfileViews === 0
        ? 100
        : ((currentWeekProfileViews - previousWeekProfileViews) /
            previousWeekProfileViews) *
          100;

    const stats = {
      totalViews: currentMonthViews,
      totalProjects,
      totalPosts,
      profileViews: currentWeekProfileViews,
      viewsTrend: Math.round(viewsTrend * 100) / 100,
      profileViewsTrend: Math.round(profileViewsTrend * 100) / 100,
    };

    console.log("Calculated stats:", stats); // Debug log

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
