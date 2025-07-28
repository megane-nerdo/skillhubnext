"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function EmployerJobList({ jobs }: { jobs: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const router = useRouter();

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

              <div className="mt-4 flex gap-4 flex-wrap items-center">
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
                {job.applications.length > 0 && (
                  <button
                    onClick={() =>
                      setOpenJobId(openJobId === job.id ? null : job.id)
                    }
                    className="text-blue-600 font-medium hover:underline transition"
                  >
                    {openJobId === job.id
                      ? "Hide Applicants"
                      : "View Applicants"}
                  </button>
                )}
              </div>

              {/* Applicants list */}
              {openJobId === job.id && (
                <div className="mt-4 border-t pt-4 space-y-4">
                  {job.applications.map((app: any) => (
                    <div
                      key={app.id}
                      className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedApplicant(app)}
                    >
                      <p className="font-medium">
                        {app.jobSeeker.user.name || "Unnamed Applicant"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {app.coverLetter.slice(0, 60)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Applicant Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
              onClick={() => setSelectedApplicant(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Applicant Info</h2>
            <p>
              <span className="font-semibold">Name: </span>
              {selectedApplicant.jobSeeker.user.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Skills: </span>
              {selectedApplicant.jobSeeker.skills || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Bio: </span>
              {selectedApplicant.jobSeeker.bio || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Cover Letter: </span>
              {selectedApplicant.coverLetter || "N/A"}
            </p>
            {selectedApplicant.jobSeeker.resumeUrl && (
              <a
                href={selectedApplicant.jobSeeker.resumeUrl}
                target="_blank"
                className="mt-3 block text-blue-600 hover:underline"
              >
                View Resume
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
