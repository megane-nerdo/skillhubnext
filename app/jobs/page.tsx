"use client";

import { useEffect, useState } from "react";
import { Job, Employer, Category } from "@prisma/client";
import Link from "next/link";
import axios from "axios";

type JobWithRelations = Job & {
  employer: Employer;
  category: Category | null;
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
        job.location?.toLowerCase().includes(term) ||
        job.category?.name.toLowerCase().includes(term) ||
        job.employer?.companyName.toLowerCase().includes(term)
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Job Listings</h1>
        <p className="text-gray-600">Browse available job opportunities</p>
      </div>

      <input
        type="text"
        placeholder="Search by title, location, or industry..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
      />

      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-4 sm:grid-cols-5 bg-gray-100 font-semibold text-gray-700 px-4 py-2 text-sm sm:text-base">
            <span>Title</span>
            <span className="hidden sm:block">Salary</span>
            <span>Category</span>
            <span>Location</span>
            <span>Employer</span>
          </div>

          {/* Job Rows */}
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="grid grid-cols-4 sm:grid-cols-5 px-4 py-3 border-t text-sm sm:text-base text-gray-800 hover:bg-gray-50 transition"
            >
              <Link
                href={`/jobs/${job.id}`}
                className="text-emerald-700 font-medium hover:underline"
              >
                {job.title}
              </Link>
              <span className="hidden sm:block">{job.salary ?? "N/A"} MMK</span>
              <span>{job.category?.name ?? "Unspecified"}</span>
              <span>{job.location}</span>
              <span>{job.employer.companyName}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
