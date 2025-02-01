// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db/connect";
import { authOptions } from "../auth/[...nextauth]/route";
import Post from "@/lib/db/models/post";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await Post.find({ userId: session.user.id }).sort({
      createdAt: -1,
    }); // Most recent first
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postData = await req.json();
    const newPost = new Post({
      ...postData,
      userId: session.user.id,
      slug: generateSlug(postData.title),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newPost.save();
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}
