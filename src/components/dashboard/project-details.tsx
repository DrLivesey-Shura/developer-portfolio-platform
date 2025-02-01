import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Github, Globe, LinkIcon } from "lucide-react";

const ProjectDetails = ({ project }) => {
  if (!project) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold">
              {project.title}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              {project.technologies?.map((tech: any) => (
                <Badge key={tech} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </div>

        {project.features && project.features.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {project.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {project.challenges && (
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Challenges & Solutions
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.challenges}
            </p>
          </div>
        )}

        {project.images && project.images.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Project Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${project.title} screenshot ${index + 1}`}
                  className="rounded-lg object-cover w-full h-48"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
