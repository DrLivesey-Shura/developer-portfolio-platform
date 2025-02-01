"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Users, FileCode, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/dashboard/stats-card";
import { Project } from "@/lib/types/project";
import { Post } from "@/lib/types/post";
import { useTrackView } from "@/lib/utils/view-tracking";
import { useSession } from "next-auth/react";

interface DashboardStats {
  totalViews: number;
  totalProjects: number;
  totalPosts: number;
  profileViews: number;
  viewsTrend: number;
  profileViewsTrend: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track profile view when dashboard is loaded
  useTrackView(session?.user?.id || "", "profile");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all required data in parallel
        const [projectsRes, postsRes, statsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/posts"),
          fetch("/api/stats"),
        ]);

        if (!projectsRes.ok || !postsRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [projectsData, postsData, statsData] = await Promise.all([
          projectsRes.json(),
          postsRes.json(),
          statsRes.json(),
        ]);

        setProjects(projectsData);
        setPosts(postsData);
        setStats(statsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session]);

  const statsCards = stats
    ? [
        {
          title: "Total Views",
          value: stats.totalViews,
          description: "from last month",
          icon: BarChart,
          trend: { value: stats.viewsTrend, isPositive: stats.viewsTrend > 0 },
        },
        {
          title: "Projects",
          value: stats.totalProjects,
          description: "active projects",
          icon: FileCode,
        },
        {
          title: "Blog Posts",
          value: stats.totalPosts,
          description: "published articles",
          icon: BookOpen,
        },
        {
          title: "Profile Views",
          value: stats.profileViews,
          description: "from last week",
          icon: Users,
          trend: {
            value: stats.profileViewsTrend,
            isPositive: stats.profileViewsTrend > 0,
          },
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.technologies.slice(0, 3).map((tech: any) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Updated{" "}
                  {project.updatedAt
                    ? new Date(project.updatedAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Blog Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts
              .filter((post) => post.status === "published")
              .slice(0, 3)
              .map((post) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">
                        Published{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {post.tags[0]}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {post.views || 0} views
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
