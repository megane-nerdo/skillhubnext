"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRef } from "react";
import { Plus, UserRound } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<any>(null);
  const [role, setRole] = useState<"EMPLOYER" | "JOBSEEKER" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedImage(e.target.files[0]); // only store, don’t upload
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let updatedData = { ...formData };

    if (selectedImage) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedImage);
      const res = await axios.post("/api/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updatedData.profilePicUrl = res.data.url;
    }

    await axios.put("/api/profile", updatedData);

    alert("Profile updated successfully.");
    setIsEditing(false);
    setUploading(false);
    router.refresh();
  };

  if (status === "loading" || !formData)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            // ------------------ EDIT MODE ------------------
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-gray-300 flex items-center justify-center bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedImage ? (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.profilePicUrl ? (
                    <img
                      src={formData.profilePicUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Plus size={40} strokeWidth={1} />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <Input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Your Name"
              />

              {role === "EMPLOYER" ? (
                <>
                  <Input
                    name="companyName"
                    value={formData.companyName || ""}
                    onChange={handleChange}
                    placeholder="Company Name"
                  />
                  <Input
                    name="companyWebsite"
                    value={formData.companyWebsite || ""}
                    onChange={handleChange}
                    placeholder="Website"
                  />
                  <Input
                    name="companyAddress"
                    value={formData.companyAddress || ""}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                  <Input
                    name="size"
                    value={formData.size || ""}
                    onChange={handleChange}
                    placeholder="Company Size"
                  />
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                  <Textarea
                    name="companyBio"
                    value={formData.companyBio || ""}
                    onChange={handleChange}
                    placeholder="Company Bio"
                  />
                </>
              ) : (
                <>
                  <Input
                    name="skills"
                    value={formData.skills || ""}
                    onChange={handleChange}
                    placeholder="Your Skills"
                  />
                  <Input
                    name="resumeUrl"
                    value={formData.resumeUrl || ""}
                    onChange={handleChange}
                    placeholder="Resume URL"
                  />
                  <Textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    placeholder="Your Bio"
                  />
                </>
              )}

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={uploading}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={uploading}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            // ------------------ VIEW MODE ------------------

            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                {formData.profilePicUrl ? (
                  <img
                    src={formData.profilePicUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <UserRound size={80} strokeWidth={1} />
                  </div>
                )}
              </div>

              <p>
                <span className="font-semibold">Name:</span> {formData.name}
              </p>

              {role === "EMPLOYER" ? (
                <>
                  <p>
                    <span className="font-semibold">Company:</span>{" "}
                    {formData.companyName}
                  </p>
                  <p>
                    <span className="font-semibold">Website:</span>{" "}
                    {formData.companyWebsite}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {formData.companyAddress}
                  </p>
                  <p>
                    <span className="font-semibold">Size:</span> {formData.size}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {formData.phoneNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Bio:</span>{" "}
                    {formData.companyBio}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-semibold">Skills:</span>{" "}
                    {formData.skills}
                  </p>
                  <p>
                    <span className="font-semibold">Resume:</span>{" "}
                    {formData.resumeUrl}
                  </p>
                  <p>
                    <span className="font-semibold">Bio:</span> {formData.bio}
                  </p>
                </>
              )}

              <Button onClick={() => setIsEditing(true)} className="w-full">
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
