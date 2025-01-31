// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db/connect";
import Project from "@/lib/db/models/project";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await Project.find({ userId: session.user.id });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectData = await req.json();
    console.log(projectData);
    console.log(session.user.id);

    const newProject = new Project({
      ...projectData,
      userId: session.user.id,
    });

    await newProject.save();
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
