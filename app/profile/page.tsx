"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<any>(null);
  const [role, setRole] = useState<"EMPLOYER" | "JOBSEEKER" | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      axios.get(`/api/profile`).then((res) => {
        setRole(res.data.role);
        setFormData(res.data);
      });
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put("/api/profile", formData);
    alert("Profile updated successfully.");
    router.refresh();
  };

  if (status === "loading" || !formData) return <p>Loading...</p>;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {role === "EMPLOYER" ? (
          <>
            <input
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full p-2 border rounded"
            />
            <input
              name="companyWebsite"
              value={formData.companyWebsite || ""}
              onChange={handleChange}
              placeholder="Company Website"
              className="w-full p-2 border rounded"
            />
            <input
              name="companyAddress"
              value={formData.companyAddress || ""}
              onChange={handleChange}
              placeholder="Company Address"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="companyBio"
              value={formData.companyBio || ""}
              onChange={handleChange}
              placeholder="Company Bio"
              className="w-full p-2 border rounded"
            />
          </>
        ) : (
          <>
            <input
              name="skills"
              value={formData.skills || ""}
              onChange={handleChange}
              placeholder="Your Skills"
              className="w-full p-2 border rounded"
            />
            <input
              name="resumeUrl"
              value={formData.resumeUrl || ""}
              onChange={handleChange}
              placeholder="Resume URL"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              placeholder="Your Bio"
              className="w-full p-2 border rounded"
            />
          </>
        )}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </main>
  );
}
