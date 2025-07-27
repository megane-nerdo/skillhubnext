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
        router.refresh();
      });
    } else {
      alert("Failed to delete job.");
    }
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Your Posted Jobs
      </h1>

      {jobs.length === 0 ? (
        <p className="text-gray-600 text-lg">
          You haven’t posted any jobs yet.
        </p>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {job.description.slice(0, 100)}...
                  </p>
                </div>

                <div className="text-sm text-gray-500 text-right">
                  <p>
                    <span className="font-medium">
                      {job.applications.length}
                    </span>{" "}
                    application{job.applications.length !== 1 && "s"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <Link
                  href={`/edit-job/${job.id}`}
                  className="text-yellow-600 font-medium hover:underline transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-red-600 font-medium hover:underline transition disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
