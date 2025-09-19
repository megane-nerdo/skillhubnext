"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Edit3,
  Trash2,
  Users,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  MoreVertical,
  ExternalLink,
  Banknote,
} from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
        <div className="text-sm text-gray-600">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No jobs posted yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by posting your first job to attract talented candidates.
          </p>
          <Link
            href="/post-job"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Edit3 size={18} />
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <Banknote size={16} />
                        <span>{job.salary} MMK</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users size={16} />
                      <span className="font-semibold">
                        {job.applications.length}
                      </span>
                      <span>applications</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                    <span>View Job</span>
                  </Link>

                  {job.applications.length > 0 && (
                    <button
                      onClick={() =>
                        setOpenJobId(openJobId === job.id ? null : job.id)
                      }
                      className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Users size={16} />
                      <span>
                        {openJobId === job.id ? "Hide" : "View"} Applicants
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/edit-job/${job.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    <span>{isPending ? "Deleting..." : "Delete"}</span>
                  </button>
                </div>
              </div>

              {/* Applicants List */}
              {openJobId === job.id && job.applications.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Applicants ({job.applications.length})
                  </h4>
                  <div className="space-y-3">
                    {job.applications.map((app: any) => (
                      <div
                        key={app.id}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => setSelectedApplicant(app)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-1">
                              {app.jobSeeker.user.name || "Unnamed Applicant"}
                            </h5>
                            <p className="text-sm text-gray-600 mb-2">
                              Applied on{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {app.coverLetter}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Link
                              href={`/profile?userId=${app.jobSeeker.user.id}`}
                              className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={14} />
                              <span>Profile</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Applicant Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Applicant Details
                </h2>
                <button
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => setSelectedApplicant(null)}
                >
                  <span className="text-gray-600 text-xl">&times;</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedApplicant.jobSeeker.user.name ||
                      "Unnamed Applicant"}
                  </h3>
                  <p className="text-gray-600">
                    Applied on{" "}
                    {new Date(selectedApplicant.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                  <p className="text-gray-700">
                    {selectedApplicant.jobSeeker.skills || "No skills listed"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                  <p className="text-gray-700">
                    {selectedApplicant.jobSeeker.bio || "No bio provided"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cover Letter
                </h4>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedApplicant.coverLetter ||
                      "No cover letter provided"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link
                  href={`/profile?userId=${selectedApplicant.jobSeeker.user.id}`}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={18} />
                  <span>View Full Profile</span>
                </Link>
                {selectedApplicant.jobSeeker.resumeUrl && (
                  <a
                    href={selectedApplicant.jobSeeker.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>View Resume</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
