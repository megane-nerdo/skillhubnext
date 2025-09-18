import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import {
  Plus,
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Calendar,
  Building2,
  BarChart3,
  Crown,
  Clock,
} from "lucide-react";

import { EmployerJobList } from "./employerJobList";

const prisma = new PrismaClient();

export default async function EmployerDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId || session?.user.role !== "EMPLOYER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need to be logged in as an employer to access this page.
          </p>
        </div>
      </div>
    );
  }

  const jobs = await prisma.job.findMany({
    where: { employerId: userId },
    include: {
      applications: {
        include: {
          jobSeeker: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Active subscription
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      employerId: userId,
      status: "activated",
      endDate: { gte: new Date() },
    },
    include: { plan: true },
  });

  // Calculate statistics
  const totalJobs = jobs.length;
  const totalApplications = jobs.reduce(
    (sum, job) => sum + job.applications.length,
    0
  );
  const recentJobs = jobs.filter((job) => {
    const jobDate = new Date(job.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return jobDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Employer Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Manage your job postings and track applications
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
              <div className="flex-1 md:flex-none bg-white rounded-xl border border-gray-100 shadow p-4 min-w-[260px]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Crown className="text-yellow-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Current Plan</p>
                    {activeSubscription ? (
                      <>
                        <p className="font-semibold text-gray-900">
                          {activeSubscription.plan.name}
                        </p>
                        <div className="mt-1 flex items-center text-sm text-gray-600">
                          <Clock size={14} className="mr-1" />
                          <span>
                            Expires{" "}
                            {new Date(
                              activeSubscription.endDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-900">
                          No active plan
                        </p>
                        <Link
                          href="/subscription"
                          className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                        >
                          Choose a plan
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Link
                href="/post-job"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Post New Job
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{totalJobs}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Briefcase size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <TrendingUp size={16} className="mr-1" />
              <span>All time</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalApplications}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <BarChart3 size={16} className="mr-1" />
              <span>Across all jobs</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{recentJobs}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-1" />
              <span>Last 30 days</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Applications
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalJobs > 0
                    ? Math.round(totalApplications / totalJobs)
                    : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Eye size={16} className="mr-1" />
              <span>Per job</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/post-job"
              className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Plus size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Post New Job</h3>
                <p className="text-sm text-gray-600">
                  Create a new job listing
                </p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Company Profile</h3>
                <p className="text-sm text-gray-600">
                  Update company information
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <EmployerJobList jobs={jobs} />
      </div>
    </div>
  );
}
