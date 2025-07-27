import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as {
    user: { id: string; role: string };
  } | null;

  if (!session || session.user.role !== "EMPLOYER") {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const industryRecord = await prisma.industry.findUnique({
    where: { name: body.industry },
  });

  const job = await prisma.job.create({
    data: {
      title: body.title,
      salary: body.salary,
      industryId: industryRecord?.id,
      location: body.location,
      description: body.description,
      employerId: session.user.id,
      benefits: body.benefits || [],
      highlights: body.highlights || [],
      careerOpportunities: body.carreerOpportunities || [],
      requirements: body.requirements || null,
    },
  });

  return Response.json(job);
}

export async function GET(req: Request) {
  const jobs = await prisma.job.findMany({
    include: {
      employer: true,
      industry: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return Response.json(jobs);
}
