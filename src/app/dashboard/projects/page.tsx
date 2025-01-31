"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/lib/types/project";
import ProjectForm from "@/components/forms/project-form";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch projects for the current user
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
        headers: {
          "Content-Type": "application/json",
        },
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
        // ✅ Correct URL
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Failed to update project", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p._id !== projectId));
      }
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };
  const openEditForm = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Button
          onClick={() => {
            setSelectedProject(null);
            setIsFormOpen(true);
          }}
        >
          Add New Project
        </Button>
      </div>

      {isFormOpen && (
        <ProjectForm
          initialData={selectedProject || undefined}
          onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
        />
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project._id} className="cursor-pointer">
            <div
              onClick={() => router.push(`/dashboard/projects/${project._id}`)}
            >
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{project.description}</p>
              </CardContent>
            </div>
            <CardContent>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    openEditForm(project);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    handleDeleteProject(project._id!);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
