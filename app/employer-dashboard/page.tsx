import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

import { EmployerJobList } from "./employerJobList";

const prisma = new PrismaClient();

export default async function EmployerDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId || session?.user.role !== "EMPLOYER") {
    return <p className="p-6 text-red-600">Access Denied</p>;
  }

  const jobs = await prisma.job.findMany({
    where: { employerId: userId },
    include: { applications: true },
    orderBy: { createdAt: "desc" },
  });

  return <EmployerJobList jobs={jobs} />;
}

// 👇 Split client logic into its own component
