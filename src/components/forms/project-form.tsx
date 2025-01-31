import React, { useState, FormEvent } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Project } from "@/lib/types/project";

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (project: Partial<Project>) => void;
  onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: initialData.title || "",
    description: initialData.description || "",
    technologies: initialData.technologies || [],
    githubLink: initialData.githubLink || "",
    liveLink: initialData.liveLink || "",
    imageUrl: initialData.imageUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const technologies = e.target.value
      ? e.target.value.split(",").map((tech) => tech.trim())
      : [];

    setFormData((prev) => ({
      ...prev,
      technologies,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData.title ? "Edit Project" : "Add New Project"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-2">
              Project Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Describe your project"
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="technologies" className="block mb-2">
              Technologies
            </label>
            <Input
              id="technologies"
              name="technologies"
              value={formData.technologies?.join(", ") || ""}
              onChange={handleTechnologiesChange}
              placeholder="Enter technologies (comma-separated)"
            />
          </div>

          <div>
            <label htmlFor="githubLink" className="block mb-2">
              GitHub Link
            </label>
            <Input
              id="githubLink"
              name="githubLink"
              type="url"
              value={formData.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label htmlFor="liveLink" className="block mb-2">
              Live Demo Link
            </label>
            <Input
              id="liveLink"
              name="liveLink"
              type="url"
              value={formData.liveLink}
              onChange={handleChange}
              placeholder="https://your-project-demo.com"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block mb-2">
              Project Image URL
            </label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/project-image.jpg"
            />
          </div>

          <div className="flex justify-between space-x-2">
            <Button type="submit" className="w-full">
              {initialData.title ? "Update Project" : "Create Project"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
