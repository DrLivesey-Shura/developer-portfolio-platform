export interface DashboardStats {
  totalViews: number;
  totalProjects: number;
  totalPosts: number;
  profileViews: number;
  viewsTrend: number; // Percentage change from previous period
  profileViewsTrend: number;
  // Could add more metrics:
  // popularPosts: Array<{ postId: string, views: number }>;
  // viewsByDay: Array<{ date: string, views: number }>;
}
