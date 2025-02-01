"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Project } from "@/lib/types/project";
import { useRouter } from "next/navigation";
import { Edit, Trash2, ExternalLink, Github, Edit2 } from "lucide-react";
import Image from "next/image";
import ProjectFormDialog from "@/components/forms/project-form";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  const handleUpdateProject = async (projectData: Partial<Project>) => {
    if (!selectedProject?._id) return;

    try {
      const response = await fetch(`/api/projects/${selectedProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(
          projects.map((p) =>
            p._id === updatedProject._id ? updatedProject : p
          )
        );
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Failed to update project", error);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const response = await fetch(`/api/projects/${projectToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p._id !== projectToDelete));
      }
    } catch (error) {
      console.error("Failed to delete project", error);
    } finally {
      setProjectToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and showcase your portfolio projects
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedProject(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2"
        >
          Add New Project
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="group relative">
            <div
              onClick={() => router.push(`/dashboard/projects/${project._id}`)}
              className="cursor-pointer"
            >
              {project.imageUrl && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{project.title}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </div>
            {/* <CardFooter className="flex justify-between mt-auto">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    setProjectToDelete(project._id!);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/projects/${project._id}`)
                }
              >
                View Details
              </Button>
            </CardFooter> */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2 bg-background/80 backdrop-blur-sm p-1 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsFormOpen(true);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    setProjectToDelete(project._id!);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ProjectFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedProject || undefined}
        onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              project and remove all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
