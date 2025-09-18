"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  CircleCheckBig,
  MapPin,
  DollarSign,
  Building2,
  Calendar,
  Users,
  Briefcase,
  Star,
  ExternalLink,
  ArrowLeft,
  Clock,
  CheckCircle,
  Globe,
  Phone,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  salary?: string;
  category?: { name: string };
  location: string;
  description: string;
  benefits?: string[];
  highlights?: string[];
  requirements?: string;
  careerOpportunities?: string[];
  applications: {
    jobSeekerId?: string;
  }[];
  employer: {
    id: string;
    companyName: string;
    companyWebsite?: string;
    companyAddress?: string;
    companyBio?: string;
    verifiedStatus?: boolean;
    profilePicUrl?: string;
  };
}

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [job, setJob] = useState<Job | null>(null);
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Failed to load job:", err);
      }
    };
    if (id) fetchJob();
  }, [id]);

  if (!job)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );

  const userRole = session?.user?.role ?? null;
  const disable = job.applications.some(
    (app) => app.jobSeekerId === session?.user.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Jobs</span>
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  {job.title}
                </h1>
                {job.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {job.category.name}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  <span className="font-medium">{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign size={20} className="text-green-600" />
                    <span className="font-medium">{job.salary} MMK</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-gray-500" />
                  <span className="text-sm">Posted recently</span>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Briefcase size={24} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Job Type</p>
                      <p className="font-semibold text-gray-900">Full-time</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Users size={24} className="text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Applications</p>
                      <p className="font-semibold text-gray-900">
                        {job.applications.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Building2 size={24} className="text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-semibold text-gray-900">
                        {job.employer.companyName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            {userRole === "JOBSEEKER" && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => router.push(`/apply/${job.id}`)}
                  disabled={disable}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    disable
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {disable ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} />
                      Already Applied
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Star size={20} />
                      Apply Now
                    </div>
                  )}
                </button>
                <p className="text-sm text-gray-500 text-center">
                  {disable
                    ? "You've already applied for this position"
                    : "Join our team today!"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase size={20} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Job Description
                </h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <CheckCircle size={20} className="text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Requirements
                  </h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Perks & Benefits */}
            {(job.benefits?.length ||
              job.highlights?.length ||
              job.careerOpportunities?.length) && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Star size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Perks & Benefits
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {job.benefits && job.benefits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle size={14} className="text-green-600" />
                        </div>
                        Benefits
                      </h3>
                      <ul className="space-y-3">
                        {job.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {job.highlights && job.highlights.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Star size={14} className="text-blue-600" />
                        </div>
                        Highlights
                      </h3>
                      <ul className="space-y-3">
                        {job.highlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {job.careerOpportunities &&
                    job.careerOpportunities.length > 0 && (
                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users size={14} className="text-purple-600" />
                          </div>
                          Career Opportunities
                        </h3>
                        <ul className="space-y-3">
                          {job.careerOpportunities.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Company Info */}
          <div className="space-y-6">
            {/* Company Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  About the Company
                </h2>
              </div>

              <div className="text-center mb-6">
                {job.employer.profilePicUrl ? (
                  <img
                    src={job.employer.profilePicUrl}
                    alt="Company Logo"
                    className="w-20 h-20 rounded-xl object-cover mx-auto border-2 border-gray-100"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl mx-auto flex items-center justify-center">
                    <Building2 size={32} className="text-indigo-600" />
                  </div>
                )}
              </div>

              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {job.employer.companyName}
                  </h3>
                  {job.employer.verifiedStatus && (
                    <CircleCheckBig size={20} className="text-green-600" />
                  )}
                </div>
                <Link
                  href={`/profile?userId=${job.employer.id}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  View Company Profile
                  <ExternalLink size={16} />
                </Link>
              </div>

              {/* Company Details */}
              <div className="space-y-4">
                {job.employer.companyWebsite && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Globe size={18} className="text-gray-500" />
                    <a
                      href={job.employer.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                {job.employer.companyAddress && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin size={18} className="text-gray-500" />
                    <span className="text-gray-700">
                      {job.employer.companyAddress}
                    </span>
                  </div>
                )}
                {job.employer.companyBio && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {job.employer.companyBio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <Star size={18} className="text-yellow-500" />
                  <span className="text-gray-700">Save Job</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <Users size={18} className="text-blue-500" />
                  <span className="text-gray-700">Share Job</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <Building2 size={18} className="text-green-500" />
                  <span className="text-gray-700">Follow Company</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
