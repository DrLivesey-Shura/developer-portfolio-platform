import mongoose from "mongoose";
import { Project } from "../../types/project";

const ProjectSchema = new mongoose.Schema<Project>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: [
      {
        type: String,
      },
    ],
    githubLink: {
      type: String,
      validate: {
        validator: (v: string) => {
          return v === "" || /^https?:\/\/(www\.)?github\.com\//.test(v);
        },
        message: "Invalid GitHub URL",
      },
    },
    liveLink: {
      type: String,
      validate: {
        validator: (v: string) => {
          return v === "" || /^https?:\/\//.test(v);
        },
        message: "Invalid URL",
      },
    },
    imageUrl: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model<Project>("Project", ProjectSchema);
