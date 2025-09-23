"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type JobSeeker = {
  id: string;
  skills?: string | null;
  bio?: string | null;
  resumeUrl?: string | null;
  user: { name: string };
};

export default function JobSeekerPage() {
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/job-seeker");
        setJobSeekers(response.data);
      } catch (error) {
        console.error("Error fetching job seekers:", error);
        setError("Failed to fetch job seekers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return jobSeekers.filter(
      (js) =>
        js.user?.name?.toLowerCase?.().includes(lower) ||
        js.skills?.toLowerCase?.().includes(lower)
    );
  }, [search, jobSeekers]);

  const deleteJobSeeker = async (id: string) => {
    const confirmed = window.confirm("Delete this job seeker?");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await axios.delete("/api/job-seeker", { data: { id } });
      setJobSeekers((prev) => prev.filter((js) => js.id !== id));
    } catch (error) {
      console.error("Error deleting job seeker:", error);
      alert("Failed to delete job seeker.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Job Seekers</h1>
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or skill"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p>No matching job seekers found.</p>
      ) : (
        <div className="rounded-xl border divide-y">
          {filtered.map((js) => (
            <div
              key={js.id}
              className="p-4 flex items-center gap-4 justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{js.user?.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {js.skills || "No skills listed"}
                </p>
                {js.bio && <p className="text-xs truncate">{js.bio}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {js.resumeUrl && (
                  <a
                    href={js.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline"
                  >
                    Resume
                  </a>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteJobSeeker(js.id)}
                  disabled={deletingId === js.id}
                >
                  {deletingId === js.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
