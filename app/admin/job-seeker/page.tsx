'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function JobSeekerPage() {
  const [jobSeekers, setJobSeekers] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/job-seeker')
      setJobSeekers(response.data)
      setFiltered(response.data)
    } catch (error) {
      console.error('Error fetching job seekers:', error)
      setError('Failed to fetch job seekers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const lower = search.toLowerCase()
    const result = jobSeekers.filter((js) =>
      js.user.name.toLowerCase().includes(lower) ||
      (js.skills?.toLowerCase().includes(lower) ?? false)
    )
    setFiltered(result)
  }, [search, jobSeekers])

  const deleteJobSeeker = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this job seeker?')
    if (!confirmed) return

    try {
      await axios.delete('/api/job-seeker', { data: { id } })
      // Refresh state
      const updated = jobSeekers.filter((js) => js.id !== id)
      setJobSeekers(updated)
      setFiltered(updated)
    } catch (error) {
      console.error('Error deleting job seeker:', error)
      alert('Failed to delete job seeker.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Seekers</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or skill..."
        className="mb-4 p-2 border rounded w-full"
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p>No matching job seekers found.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((js) => (
            <li key={js.id} className="border p-4 rounded relative">
              <h2 className="text-xl font-semibold">{js.user.name}</h2>
              <p className="text-gray-600 italic">{js.skills || 'No skills listed'}</p>
              <p className="mb-2">{js.bio || 'No bio available'}</p>
              {js.resumeUrl && (
                <a
                  href={js.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Resume
                </a>
              )}

              <button
                onClick={() => deleteJobSeeker(js.id)}
                className="absolute top-4 right-4 text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
