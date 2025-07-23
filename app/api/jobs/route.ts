import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { postJobSchema } from "../../post-job/postJobSchema";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("POST /api/jobs");
  const session = (await getServerSession(authOptions)) as {
    user: { id: string; role: string };
  } | null;
  if (session?.user.role !== "EMPLOYER") {
    console.log("Unauthorized access attempt by:", session?.user);
  }
  if (!session || session.user.role !== "EMPLOYER") {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  console.log(
    body.salary,
    body.title,
    body.industry,
    body.location,
    body.description
  );
  const industryRecord = await prisma.industry.findUnique({
    where: { name: body.industry },
  });
  console.log("Industry Record:", industryRecord);
  const job = await prisma.job.create({
    data: {
      title: body.title,
      salary: body.salary,
      industryId: industryRecord?.id,
      location: body.location,
      description: body.description,
      employerId: session.user.id,
    },
  });

  return Response.json(job);
}

export async function GET(req: Request) {
  console.log("GET /api/jobs");
  const jobs = await prisma.job.findMany({
    include: {
      employer: true,
    },
  });
  return Response.json(jobs);
}
