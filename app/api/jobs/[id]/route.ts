import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { postJobSchema } from "../../../post-job/postJobSchema";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      industry: true,
      employer: true,
    },
  });

  if (!job) {
    return new Response("Job not found", { status: 404 });
  }

  return new Response(
    JSON.stringify({
      ...job,
      careerOpportunities: job.careerOpportunities ?? [], // ← this ensures it's not undefined
      benefits: job.benefits ?? [],
      highlights: job.highlights ?? [],
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = await context;
  const jobId = params.id;

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const jobId = params.id;

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const parsed = postJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      title,
      salary,
      industry,
      location,
      description,
      requirements,
      benefits,
      highlights,
      careerOpportunities,
    } = parsed.data;

    // Find the industry by name
    const industryRecord = await prisma.industry.findFirst({
      where: { name: industry },
    });

    if (!industryRecord) {
      return NextResponse.json(
        { error: "Industry not found" },
        { status: 404 }
      );
    }

    // Update the job
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        salary,
        location,
        description,
        industryId: industryRecord.id,
        requirements,
        benefits: benefits ? benefits.split(",").map((b) => b.trim()) : [],
        highlights: highlights
          ? highlights.split(",").map((h) => h.trim())
          : [],
        careerOpportunities: careerOpportunities
          ? careerOpportunities.split(",").map((c) => c.trim())
          : [],
      },
    });

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (err) {
    console.error("PUT /api/jobs/[id] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
