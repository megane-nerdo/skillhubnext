"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
export default function ApplyJobPage() {
  const { id } = useParams();
  const router = useRouter();
  // const { data: session } = useSession()
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchJob = async () => {
      const res = await axios.get(`/api/jobs/${id}`);
      setJob(res.data);
    };

    fetchJob();
  }, [id]);
  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`/api/apply/${id}`, {
        coverLetter: data.coverLetter, // replace with actual data
      });

      if (res.status === 200) {
        reset();
        router.push("/dashboard"); // redirect to job seeker dashboard
      }
    } catch (err: any) {
      setError(err.response?.data || "Failed to apply");
    }

    setLoading(false);
  };

  if (!job) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Apply for: {job.title}</h1>
      <p className="mb-4 text-gray-700">{job.description}</p>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("coverLetter", { required: true })}
          placeholder="Your cover letter..."
          className="w-full border rounded p-2"
          rows={5}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </main>
  );
}
