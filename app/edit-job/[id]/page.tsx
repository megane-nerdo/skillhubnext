// app/employer-dashboard/edit/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import EditJobClient from "./editJobClient";
const prisma = new PrismaClient();

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId || session?.user.role !== "EMPLOYER") {
    return <p className="p-6 text-red-600">Access Denied</p>;
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: { industry: true },
  });

  if (!job || job.employerId !== userId) {
    return <p className="p-6">Job not found or unauthorized</p>;
  }

  return <EditJobClient job={job} />;
}
