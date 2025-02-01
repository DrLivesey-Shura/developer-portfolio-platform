"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Trash2,
  Github,
  Globe,
  Code2,
} from "lucide-react";

export interface Project {
  _id?: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
  imageUrl?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch project");
        const data = await response.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message);
        router.push("/dashboard/projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id, router]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/projects/${project?._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/projects");
      }
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push("/dashboard/projects")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
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
          {/* Project Image */}
          {project.imageUrl && (
            <div className="relative h-96 -mt-6 -mx-6 mb-6 overflow-hidden rounded-t-lg">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Actions */}
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl font-bold">{project.title}</h1>
              <div className="flex gap-2">
                {project.githubLink && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  </Button>
                )}
                {project.liveLink && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4" /> Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created:{" "}
                {project.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated:{" "}
                {project.updatedAt
                  ? new Date(project.updatedAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Code2 className="w-4 h-4" />
                <span className="font-medium">Technologies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              project and remove it from your portfolio.
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
