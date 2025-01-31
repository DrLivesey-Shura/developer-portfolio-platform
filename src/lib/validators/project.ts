import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  technologies: z.array(z.string()).optional(),
  githubLink: z.string().url({ message: "Invalid GitHub URL" }).optional(),
  liveLink: z.string().url({ message: "Invalid Live Demo URL" }).optional(),
  imageUrl: z.string().url({ message: "Invalid Image URL" }).optional(),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
