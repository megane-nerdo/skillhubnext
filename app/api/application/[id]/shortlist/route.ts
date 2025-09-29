import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { params } = await context;
  const applicationId = params.id;
  const body = await req.json();
  const { isShortlisted } = body;

  if (typeof isShortlisted !== "boolean") {
    return NextResponse.json(
      { error: "isShortlisted must be a boolean" },
      { status: 400 }
    );
  }

  try {
    // Check if application exists and belongs to employer's job
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            employer: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if the employer owns this job
    if (application.job.employer.id !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to modify this application" },
        { status: 403 }
      );
    }

    // Update the shortlist status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { isShortlisted },
      include: {
        jobSeeker: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error("Error updating shortlist status:", error);
    return NextResponse.json(
      { error: "Failed to update shortlist status" },
      { status: 500 }
    );
  }
}
