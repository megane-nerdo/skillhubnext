"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/jobs/${params.id}`);
        setJob(response.data);
      } catch (err) {
        console.error(err);
        setError("Job not found.");
      }
    };

    fetchJob();
  }, [params.id]);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!job) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
      <p>{job.description}</p>
    </main>
  );
}
