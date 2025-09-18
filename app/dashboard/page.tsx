import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ExternalLink,
  TrendingUp,
  Users,
  Star,
  Banknote,
} from "lucide-react";

const prisma = new PrismaClient();

export default async function JobSeekerDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId || session.user.role !== "JOBSEEKER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need to be logged in as a job seeker to access this page.
          </p>
        </div>
      </div>
    );
  }

  const apps = await prisma.application.findMany({
    where: { jobSeekerId: userId },
    include: {
      job: {
        include: {
          employer: true,
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate statistics
  const totalApplications = apps.length;
  const recentApplications = apps.filter((app) => {
    const appDate = new Date(app.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return appDate >= sevenDaysAgo;
  }).length;

  // Mock status distribution (you can implement real status tracking)
  const statusCounts = {
    pending: apps.length, // All applications start as pending
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Job Seeker Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track your job applications and manage your career journey
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-gray-900">
                  {recentApplications}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-1" />
              <span>Last 7 days</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">
                  {statusCounts.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-1" />
              <span>Under review</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalApplications > 0
                    ? Math.round(
                        (statusCounts.accepted / totalApplications) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <TrendingUp size={16} className="mr-1" />
              <span>Acceptance rate</span>
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
              href="/jobs"
              className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Browse Jobs</h3>
                <p className="text-sm text-gray-600">Find new opportunities</p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Update Profile</h3>
                <p className="text-sm text-gray-600">
                  Keep your profile current
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Career Tips</h3>
                <p className="text-sm text-gray-600">
                  Improve your applications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Applications
            </h2>
            <div className="text-sm text-gray-600">
              {apps.length} application{apps.length !== 1 ? "s" : ""} total
            </div>
          </div>

          {apps.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start applying to jobs to see your applications here.
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Briefcase size={18} />
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {app.job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building2 size={16} />
                          <span>{app.job.employer.companyName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{app.job.location}</span>
                        </div>
                        {app.job.salary && (
                          <div className="flex items-center gap-1">
                            <Banknote size={16} />
                            <span>{app.job.salary} MMK</span>
                          </div>
                        )}
                        {app.job.category && (
                          <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {app.job.category.name}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 line-clamp-2">
                        {app.job.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <Calendar size={16} />
                          <span>
                            Applied{" "}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-700 font-medium">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/jobs/${app.job.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                        <span>View Job</span>
                      </Link>

                      <div className="flex items-center gap-2 px-4 py-2 text-gray-600">
                        <Clock size={16} />
                        <span>Under Review</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      Application ID: {app.id.slice(-8)}
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Your Cover Letter
                    </h4>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-700 line-clamp-3">
                        {app.coverLetter}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
