"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  salary: string | null;
  location: string | null;
  description: string | null;
  createdAt: string;
  employer: {
    id: string;
    companyName: string | null;
    user: { name: string };
  };
  category: {
    id: string;
    name: string;
  } | null;
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title?.toLowerCase?.().includes(lower) ||
        job.employer?.companyName?.toLowerCase?.().includes(lower) ||
        job.employer?.user?.name?.toLowerCase?.().includes(lower) ||
        job.category?.name?.toLowerCase?.().includes(lower) ||
        job.location?.toLowerCase?.().includes(lower)
    );
  }, [search, jobs]);

  const deleteJob = async (id: string) => {
    const confirmed = window.confirm("Delete this job?");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await axios.delete(`/api/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, company, employer, category, or location"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="rounded-xl border divide-y">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="p-4 flex items-center gap-4 justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{job.title}</p>
                  {job.salary && (
                    <span className="text-sm text-green-600 font-medium">
                      {job.salary}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {job.employer?.companyName || job.employer?.user?.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {job.category?.name && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {job.category.name}
                    </span>
                  )}
                  {job.location && <span>{job.location}</span>}
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/jobs/${job.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteJob(job.id)}
                  disabled={deletingId === job.id}
                >
                  {deletingId === job.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
