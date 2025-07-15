import JobCard from '@/components/JobCard'
import { jobs } from '../lib/mockData'
import { PrismaClient } from '@prisma/client' 
import Link from 'next/link'  
const prisma = new PrismaClient()
export default async function JobListPage() {
  const jobs = await prisma.job.findMany({
    
    include: {
      employer: true},
    orderBy: { createdAt: 'desc' },
  })
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recent Posted Job</h1>

      {jobs.length === 0 ? (
        <p>Jobs unavailable</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p>{job.description.slice(0, 100)}...</p>
              <p className="text-sm text-gray-500">
                Posted by {job.employer.name} • {job.location}  
              </p>
              <div className="mt-2 flex gap-4">
                <Link href={`/jobs/${job.id}`} className="text-yellow-600 underline">Detail</Link>
                <Link href={`/apply/${job.id}`} className="text-blue-600 underline">Apply</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
