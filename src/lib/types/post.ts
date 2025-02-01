// src/lib/types/post.ts
export interface Post {
  _id?: string;
  userId: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  tags?: string[];
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}
