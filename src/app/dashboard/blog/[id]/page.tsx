// src/app/dashboard/blog/[id]/overview/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Post } from "@/lib/types/post";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
  Eye,
  Globe,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BlogDialog from "@/components/forms/blog-form";

export default function BlogOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        router.push("/dashboard/blog");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id, router]);

  const handleUpdate = async (postData: Partial<Post>) => {
    try {
      const response = await fetch(`/api/posts/${post?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPost(updatedPost);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${post?._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/blog");
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push("/dashboard/blog")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Posts
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit2 className="w-4 h-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 space-y-6">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-[400px] -mt-6 -mx-6 mb-6">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Status */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <Badge
                variant={post.status === "published" ? "default" : "secondary"}
                className="capitalize"
              >
                {post.status}
              </Badge>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated: {new Date(post.updatedAt).toLocaleDateString()}
              </div>
              {post.status === "published" && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <a
                    href={`/portfolio/${post.userId}/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    View Public Post
                  </a>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Excerpt */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">Excerpt</h2>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">Content</h2>
              <div className="whitespace-pre-wrap text-muted-foreground">
                {post.content}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <BlogDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={post}
        onSubmit={handleUpdate}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
