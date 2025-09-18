"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRef } from "react";
import {
  Plus,
  UserRound,
  Edit3,
  MapPin,
  Phone,
  Globe,
  Building2,
  Users,
  FileText,
  Award,
  Mail,
  Calendar,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<any>(null);
  const [role, setRole] = useState<"EMPLOYER" | "JOBSEEKER" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userId = searchParams.get("userId");
    setProfileUserId(userId);
    setIsOwnProfile(!userId);

    if (session?.user) {
      const apiUrl = userId ? `/api/profile?userId=${userId}` : `/api/profile`;
      axios
        .get(apiUrl)
        .then((res) => {
          setRole(res.data.role);
          setFormData(res.data);
        })
        .catch((err) => {
          console.error("Failed to load profile:", err);
          if (userId) {
            // If viewing another user's profile fails, redirect to own profile
            router.push("/profile");
          }
        });
    }
  }, [session, searchParams, router]);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="relative">
          {/* Background Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-200 to-cyan-200/40 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bg-gradient-to-t from-blue-100/20 to-emerald-100/50 bottom-0 left-0 right-0 h-24"></div>
          </div>

          {/* Profile Picture and Basic Info */}
          <div className="relative -mt-16 px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  {formData.profilePicUrl ? (
                    <img
                      src={formData.profilePicUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                      <UserRound
                        size={60}
                        className="text-blue-600"
                        strokeWidth={1}
                      />
                    </div>
                  )}
                </div>
                {isEditing && isOwnProfile && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-black">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">
                    {formData.name || "Anonymous User"}
                  </h1>
                  {role === "EMPLOYER" && (
                    <span className="px-3 py-1 bg-black/20 rounded-full text-sm font-medium">
                      <Building2 size={16} className="inline mr-1" />
                      Employer
                    </span>
                  )}
                  {role === "JOBSEEKER" && (
                    <span className="px-3 py-1 bg-black/20 rounded-full text-sm font-medium">
                      <UserRound size={16} className="inline mr-1" />
                      Job Seeker
                    </span>
                  )}
                </div>
                {/* {role === "EMPLOYER" && formData.companyName && (
                  <p className="text-xl text-white/90 mb-2">
                    {formData.companyName}
                  </p>
                )} */}
                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                  {formData.companyWebsite && (
                    <div className="flex items-center gap-1">
                      <Globe size={16} />
                      <a
                        href={formData.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  {formData.companyAddress && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {formData.companyAddress}
                    </div>
                  )}
                  {formData.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone size={16} />
                      {formData.phoneNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              {isOwnProfile && !isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-blue-600 hover:bg-gray-50 shadow-lg"
                >
                  <Edit3 size={18} className="mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing && isOwnProfile ? (
                  <Textarea
                    name={role === "EMPLOYER" ? "companyBio" : "bio"}
                    value={
                      role === "EMPLOYER"
                        ? formData.companyBio || ""
                        : formData.bio || ""
                    }
                    onChange={handleChange}
                    placeholder={
                      role === "EMPLOYER"
                        ? "Tell us about your company..."
                        : "Tell us about yourself..."
                    }
                    className="min-h-[120px] resize-none"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {(role === "EMPLOYER"
                      ? formData.companyBio
                      : formData.bio) || "No information provided"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Skills/Company Details Section */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  {role === "EMPLOYER" ? (
                    <>
                      <Building2 size={20} className="text-blue-600" />
                      Company Details
                    </>
                  ) : (
                    <>
                      <Award size={20} className="text-blue-600" />
                      Skills & Experience
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {role === "EMPLOYER" ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Company Size
                        </label>
                        {isEditing ? (
                          <Input
                            name="size"
                            value={formData.size || ""}
                            onChange={handleChange}
                            placeholder="e.g., 10-50 employees"
                          />
                        ) : (
                          <p className="text-gray-700">
                            {formData.size || "Not specified"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <Input
                            name="phoneNumber"
                            value={formData.phoneNumber || ""}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                          />
                        ) : (
                          <p className="text-gray-700">
                            {formData.phoneNumber || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">
                        Company Address
                      </label>
                      {isEditing ? (
                        <Input
                          name="companyAddress"
                          value={formData.companyAddress || ""}
                          onChange={handleChange}
                          placeholder="123 Main St, City, State"
                        />
                      ) : (
                        <p className="text-gray-700">
                          {formData.companyAddress || "Not provided"}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">
                        Skills
                      </label>
                      {isEditing ? (
                        <Input
                          name="skills"
                          value={formData.skills || ""}
                          onChange={handleChange}
                          placeholder="JavaScript, React, Node.js, Python..."
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.skills ? (
                            formData.skills
                              .split(",")
                              .map((skill: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                >
                                  {skill.trim()}
                                </span>
                              ))
                          ) : (
                            <span className="text-gray-400 italic">
                              No skills listed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">
                        Resume
                      </label>
                      {isEditing ? (
                        <Input
                          name="resumeUrl"
                          value={formData.resumeUrl || ""}
                          onChange={handleChange}
                          placeholder="https://example.com/resume.pdf"
                        />
                      ) : formData.resumeUrl ? (
                        <a
                          href={formData.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">
                          No resume uploaded
                        </span>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm">{session?.user?.email}</span>
                </div>
                {formData.phoneNumber && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm">{formData.phoneNumber}</span>
                  </div>
                )}
                {formData.companyWebsite && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Globe size={16} className="text-gray-400" />
                    <a
                      href={formData.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Badge */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {role === "EMPLOYER" ? (
                    <>
                      <Building2 size={20} className="text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Employer</p>
                        <p className="text-sm text-gray-600">Company Account</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <UserRound size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Job Seeker</p>
                        <p className="text-sm text-gray-600">
                          Individual Account
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Form Actions */}
        {isEditing && isOwnProfile && (
          <div className="mt-8 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={uploading}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={uploading}
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
