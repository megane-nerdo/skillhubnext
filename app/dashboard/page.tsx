import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function JobSeekerDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId || session.user.role !== "JOBSEEKER") {
    return <p className="p-6 text-red-600">Access Denied</p>;
  }

  const apps = await prisma.application.findMany({
    where: { jobSeekerId: userId },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
      {apps.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {apps.map((app) => (
            <li key={app.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{app.job.title}</h2>
              <p className="text-sm text-gray-500">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2">{app.coverLetter}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
