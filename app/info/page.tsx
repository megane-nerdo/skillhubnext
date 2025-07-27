"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      axios
        .get(`/api/user-info?email=${session.user.email}`)
        .then((res) => {
          setUserInfo(res.data);
          setFormData(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user info", err);
          setError("Failed to load user information.");
        });
    }
  }, [session, status]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session?.user) return <p>Not authenticated.</p>;
  if (!userInfo) return <p>Loading user info...</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put("/api/user-info", formData);
      setEditMode(false);
      setUserInfo(res.data);
      setError("");
    } catch (error) {
      console.error("Update failed", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white border">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        My Profile
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          {editMode ? (
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{userInfo.name || "-"}</p>
          )}
        </div>

        {userInfo.role === "EMPLOYER" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              {editMode ? (
                <input
                  name="companyName"
                  value={formData.companyName || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{userInfo.companyName || "-"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Website
              </label>
              {editMode ? (
                <input
                  name="companyWebsite"
                  value={formData.companyWebsite || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">
                  {userInfo.companyWebsite || "-"}
                </p>
              )}
            </div>
          </>
        )}

        {userInfo.role === "JOBSEEKER" && (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              {editMode ? (
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">
                  {userInfo.bio || "-"}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              {editMode ? (
                <input
                  name="skills"
                  value={formData.skills || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{userInfo.skills || "-"}</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        {editMode ? (
          <>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setFormData(userInfo);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </main>
  );
}
