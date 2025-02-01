"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Post } from "@/lib/types/post";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Edit2, Trash2 } from "lucide-react";
import BlogDialog from "@/components/forms/blog-form";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (postData: Partial<Post>) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  const handleUpdatePost = async (postData: Partial<Post>) => {
    if (!selectedPost?._id) return;

    try {
      const response = await fetch(`/api/posts/${selectedPost._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(
          posts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
        );
        setSelectedPost(null);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p._id !== postId));
        setPostToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your blog content</p>
        </div>
        <Button
          onClick={() => {
            setSelectedPost(null);
            setIsDialogOpen(true);
          }}
        >
          Create New Post
        </Button>
      </div>

      <BlogDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedPost || undefined}
        onSubmit={selectedPost ? handleUpdatePost : handleCreatePost}
      />

      <AlertDialog
        open={!!postToDelete}
        onOpenChange={() => setPostToDelete(null)}
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
              onClick={() => postToDelete && handleDeletePost(postToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post._id} className="group relative">
            <div
              onClick={() => router.push(`/dashboard/blog/${post._id}`)}
              className="cursor-pointer"
            >
              {post.coverImage && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                  >
                    {post.status}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {post.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(post.updatedAt).toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2 bg-background/80 backdrop-blur-sm p-1 rounded-lg">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPost(post);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPostToDelete(post._id!);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
