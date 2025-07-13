// app/jobs/[id]/page.tsx..
import { jobs } from '../../lib/mockData'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = jobs.find((job) => job.id === params.id)

  if (!job) return notFound()

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-600">{job.company} • {job.location}</p>
      <p className="mt-4">{job.description}</p>
      <Link
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded inline-block text-center"
        href={`/apply/${job.id}`}
      >
        Apply Now
      </Link>
      
    </main>
  )
}
