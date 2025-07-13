import { applications } from '../lib/mockApplications'

export default function JobSeekerDashboard() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
      {applications.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{app.jobTitle}</h2>
              <p className="text-gray-600">{app.company}</p>
              <p className="text-sm text-gray-500">Applied on {app.dateApplied}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
