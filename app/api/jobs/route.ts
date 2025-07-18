import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/auth";
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
  const job = await prisma.job.create({
    data: {
      title: body.title,
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
export async function DELETE(req: Request) {
  console.log("DELETE /api/jobs/:id");
  const session = (await getServerSession(authOptions)) as {
    user: { id: string; role: string };
  } | null;
  if (!session || session.user.role !== "EMPLOYER") {
    return new Response("Unauthorized", { status: 401 });
  }

  const jobId = req.url.split("/").pop();
  if (!jobId) {
    return new Response("Job ID is required", { status: 400 });
  }

  await prisma.job.delete({
    where: { id: jobId, employerId: session.user.id },
  });

  return Response.json({ message: "Job deleted successfully" });
}
