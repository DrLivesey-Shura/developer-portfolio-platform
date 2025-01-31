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
