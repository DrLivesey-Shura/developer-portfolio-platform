// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db/connect";
import { authOptions } from "../../auth/[...nextauth]/route";
import Post from "@/lib/db/models/post";
import generateSlug from "@/lib/utils/slug";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const postData = await req.json();
    const post = await Post.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      {
        ...postData,
        slug: generateSlug(postData.title),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
