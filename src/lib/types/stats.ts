export interface PageView {
  _id?: string;
  userId: string; // ID of the content owner
  targetId: string; // ID of the viewed content (post ID or profile ID)
  targetType: "post" | "profile" | "project";
  viewedAt: Date;
  visitorId: string; // Unique identifier for the visitor (can be anonymous)
  // Optional: Add more tracking data
  referrer?: string;
  userAgent?: string;
}
