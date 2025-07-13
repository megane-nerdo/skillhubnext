import JobCard from '@/components/JobCard'
import { jobs } from '../lib/mockData'

export default function JobListPage() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </main>
  )
}
