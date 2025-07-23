"use client";

import { useEffect, useState } from "react";
import { Job, Employer, Industry } from "@prisma/client";
import Link from "next/link";
import axios from "axios";

type JobWithRelations = Job & {
  employer: Employer;
  industry: Industry | null;
};

export default function JobListPage() {
  const [jobs, setJobs] = useState<JobWithRelations[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithRelations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get("/api/jobs");
      setJobs(res.data);
      setFilteredJobs(res.data);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        job.industry?.name.toLowerCase().includes(term)
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Recently Posted Jobs</h1>
        <p className="text-gray-600">Find your next career opportunity</p>
      </div>

      <input
        type="text"
        placeholder="Search by title, location, or industry..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
      />

      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-emerald-700 mb-1">
                  {job.title}
                </h2>
                <p className="text-gray-800 font-medium mb-2">
                  {job.salary} MMK
                </p>
                <p className="text-gray-600 mb-1">
                  Industry: {job.industry?.name ?? "Unspecified"}
                </p>
                <p className="text-gray-600 mb-2">
                  {job.description.slice(0, 100)}...
                </p>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                Posted by{" "}
                <span className="font-medium text-gray-700">
                  {job.employer.companyName}
                </span>{" "}
                • {job.location}
              </div>

              <div className="flex gap-3 mt-auto">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-sm text-yellow-600 underline hover:text-yellow-700"
                >
                  View Details
                </Link>
                <Link
                  href={`/apply/${job.id}`}
                  className="text-sm text-blue-600 underline hover:text-blue-700"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
