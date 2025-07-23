import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  console.log("Received request to apply for job");
  const { params } = await context;
  const jobId = params.id;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.role !== "JOBSEEKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  const body = await req.json();
  const { coverLetter } = body;

  if (!coverLetter || coverLetter.trim() === "") {
    return NextResponse.json(
      { error: "Cover letter is required" },
      { status: 400 }
    );
  }

  try {
    // Optional: Check if the job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Optional: Prevent duplicate applications
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        jobSeekerId: user.id,
      },
    });
    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        coverLetter,
        jobId,
        jobSeekerId: user.id,
      },
    });

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
  }
}
