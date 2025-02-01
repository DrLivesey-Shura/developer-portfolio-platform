import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  targetId: { type: String, required: true, index: true },
  targetType: {
    type: String,
    required: true,
    enum: ["post", "profile", "project"],
  },
  viewedAt: { type: Date, default: Date.now, index: true },
  visitorId: { type: String, required: true },
  referrer: String,
  userAgent: String,
});

// Add compound indexes for efficient querying
pageViewSchema.index({ userId: 1, targetType: 1, viewedAt: 1 });
pageViewSchema.index({ targetId: 1, viewedAt: 1 });

export const PageView =
  mongoose.models.PageView || mongoose.model("PageView", pageViewSchema);
