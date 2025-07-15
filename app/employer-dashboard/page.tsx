import { authOptions } from "@/app/lib/auth";
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function EmployerDashboard() {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId || session?.user.role !== 'EMPLOYER') {
    return <p className="p-6 text-red-600">Access Denied</p>
  }

  const jobs = await prisma.job.findMany({
    where: { employerId: userId },
    include: { Application: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Posted Jobs</h1>

      {jobs.length === 0 ? (
        <p>You haven’t posted any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p>{job.description.slice(0, 100)}...</p>
              <p className="text-sm text-gray-500">
                Applications: {job.Application.length}
              </p>
              <div className="mt-2 flex gap-4">
                <Link href={`/edit-job/${job.id}`} className="text-yellow-600 underline">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
