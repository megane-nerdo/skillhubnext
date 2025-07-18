// components/JobCard.tsx
import Link from 'next/link'

export default function JobCard({
  id,
  title,
  employer,
  location,
  description,
}: {
  id: string
  title: string
  employer: string
  location: string
  description: string
}) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-md transition">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600">{employer} • {location}</p>
      <p className="mt-2 text-sm">{description}</p>
      <Link
        href={`/jobs/${id}`}
        className="inline-block mt-3 text-blue-600 hover:underline"
      >
        View Details →
      </Link>
    </div>
  )
}
