"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
export function EmployerJobList({ jobs }: { jobs: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    const confirmed = confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    const res = await fetch(`/api/jobs/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      startTransition(() => {
        router.refresh(); // Re-fetch data
      });
    } else {
      alert("Failed to delete job.");
    }
  }

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
                Applications: {job.applications.length}
              </p>
              <div className="mt-2 flex gap-4">
                <Link
                  href={`/edit-job/${job.id}`}
                  className="text-yellow-600 underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-red-600 underline"
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
