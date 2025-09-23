"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Crown,
  User,
  Briefcase,
  Home,
  Building2,
  LandPlot,
  Settings,
  Users,
  FolderOpen,
  FileText,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <LandPlot className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">SkillHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>

            <Link
              href="/jobs"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Briefcase size={16} />
              <span>Jobs</span>
            </Link>

            {session?.user && session?.user?.role !== "ADMIN" && (
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User size={16} />
                <span>Profile</span>
              </Link>
            )}

            {session?.user?.role === "EMPLOYER" && (
              <>
                <Link
                  href="/post-job"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Post Job
                </Link>
                <Link
                  href="/employer-dashboard"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/subscription"
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  <Crown size={16} />
                  <span>Subscription</span>
                </Link>
              </>
            )}

            {session?.user?.role === "JOBSEEKER" && (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                My Applications
              </Link>
            )}

            {session?.user?.role === "ADMIN" && (
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Settings size={16} />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin/employer"
                    className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Building2 size={14} />
                    <span>Employers</span>
                  </Link>
                  <Link
                    href="/admin/job-seeker"
                    className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Users size={14} />
                    <span>Job Seekers</span>
                  </Link>
                  <Link
                    href="/admin/jobs"
                    className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Briefcase size={14} />
                    <span>Jobs</span>
                  </Link>
                  <Link
                    href="/admin/category"
                    className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FolderOpen size={14} />
                    <span>Categories</span>
                  </Link>
                </div>
              </div>
            )}

            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>

              <Link
                href="/jobs"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Briefcase size={18} />
                <span>Jobs</span>
              </Link>

              {session?.user && (
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
              )}

              {session?.user?.role === "EMPLOYER" && (
                <>
                  <Link
                    href="/post-job"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"
                  >
                    <Briefcase size={18} />
                    <span>Post Job</span>
                  </Link>
                  <Link
                    href="/employer-dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Building2 size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/subscription"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg"
                  >
                    <Crown size={18} />
                    <span>Subscription</span>
                  </Link>
                </>
              )}

              {session?.user?.role === "JOBSEEKER" && (
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={18} />
                  <span>My Applications</span>
                </Link>
              )}

              {session?.user?.role === "ADMIN" && (
                <>
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg"
                  >
                    <Settings size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                  <div className="pl-6 space-y-1">
                    <Link
                      href="/admin/employer"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Building2 size={16} />
                      <span>Employers</span>
                    </Link>
                    <Link
                      href="/admin/job-seeker"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Users size={16} />
                      <span>Job Seekers</span>
                    </Link>
                    <Link
                      href="/admin/jobs"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Briefcase size={16} />
                      <span>Jobs</span>
                    </Link>
                    <Link
                      href="/admin/category"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FolderOpen size={16} />
                      <span>Categories</span>
                    </Link>
                  </div>
                </>
              )}

              {session ? (
                <button
                  onClick={() => {
                    closeMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User size={18} />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"
                  >
                    <User size={18} />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
