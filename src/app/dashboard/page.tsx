// src/app/dashboard/page.tsx
import React from "react";
import { BarChart, Users, FileCode, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/stats-card";

// Dummy data
const stats = [
  {
    title: "Total Views",
    value: 1234,
    description: "from last month",
    icon: BarChart,
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Projects",
    value: 8,
    description: "active projects",
    icon: FileCode,
  },
  {
    title: "Blog Posts",
    value: 12,
    description: "published articles",
    icon: BookOpen,
  },
  {
    title: "Profile Views",
    value: 567,
    description: "from last week",
    icon: Users,
    trend: { value: 8, isPositive: true },
  },
];

const recentProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    tech: ["React", "Node.js", "MongoDB"],
    lastUpdated: "2024-01-25",
  },
  {
    id: 2,
    name: "Chat Application",
    tech: ["Next.js", "Socket.io", "PostgreSQL"],
    lastUpdated: "2024-01-20",
  },
  {
    id: 3,
    name: "Task Manager",
    tech: ["Vue.js", "Express", "MySQL"],
    lastUpdated: "2024-01-15",
  },
];

const recentPosts = [
  {
    id: 1,
    title: "Understanding React Hooks",
    views: 234,
    publishDate: "2024-01-28",
  },
  {
    id: 2,
    title: "Building Scalable APIs",
    views: 187,
    publishDate: "2024-01-22",
  },
  { id: 3, title: "CSS Grid Mastery", views: 156, publishDate: "2024-01-18" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Updated {project.lastUpdated}
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
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-gray-600">
                    Published {post.publishDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {post.views} views
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
