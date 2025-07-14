"use client";

import { jobs as mockJobs } from "../lib/mockData";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
const prisma = new PrismaClient();

export default function EmployerDashboard() {
  const jobs = mockJobs; // Replace with actual data fetching logic

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );
    const deleteJob = () => {
      if (confirmed) {
        axios.delete(`/api/jobs/${id}`);
        // Optionally, you can refresh the page or update the state to reflect the deletion
        window.location.reload();
      }
    };
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employer Dashboard</h1>

      {jobs.length === 0 ? (
        <p>You haven’t posted any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.location}</p>
              <div className="mt-2 flex gap-4">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/edit-job/${job.id}`}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
