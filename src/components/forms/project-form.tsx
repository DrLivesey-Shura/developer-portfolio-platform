import React, { useState, FormEvent } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Project } from "@/lib/types/project";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Project>;
  onSubmit: (project: Partial<Project>) => void;
}

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  open,
  onOpenChange,
  initialData = {},
  onSubmit,
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
    setFormData((prev) => ({ ...prev, technologies }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData.title ? "Edit Project" : "Add New Project"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Project Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full min-h-[100px] p-2 border rounded-md resize-y"
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label
              htmlFor="technologies"
              className="block text-sm font-medium mb-2"
            >
              Technologies
            </label>
            <Input
              id="technologies"
              name="technologies"
              value={formData.technologies?.join(", ")}
              onChange={handleTechnologiesChange}
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          <div>
            <label
              htmlFor="githubLink"
              className="block text-sm font-medium mb-2"
            >
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
            <label
              htmlFor="liveLink"
              className="block text-sm font-medium mb-2"
            >
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
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium mb-2"
            >
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {initialData.title ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
