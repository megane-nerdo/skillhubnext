"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Users,
  Building2,
  Target,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  LandPlot,
  MonitorSmartphone,
  HeartPlus,
  Landmark,
  BookOpen,
  ChartCandlestick,
  PencilRuler,
} from "lucide-react";
import TopEmployersSection from "@/components/CompanySection";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const stats = [
    { number: "10,000+", label: "Active Jobs", icon: Briefcase },
    { number: "5,000+", label: "Companies", icon: Building2 },
    { number: "50,000+", label: "Job Seekers", icon: Users },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Matching",
      description:
        "Our AI-powered algorithm matches you with the perfect opportunities in seconds.",
    },
    {
      icon: Shield,
      title: "Verified Employers",
      description:
        "Every employer is thoroughly verified to ensure safe and legitimate job opportunities.",
    },
    {
      icon: Target,
      title: "Smart Applications",
      description:
        "Apply to multiple jobs with one-click and track your progress in real-time.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description:
        "Get personalized career guidance from our team of recruitment experts.",
    },
  ];

  const jobCategories = [
    { name: "Technology", count: "2,500+", icon: MonitorSmartphone },
    { name: "Healthcare", count: "1,800+", icon: HeartPlus },
    { name: "Finance", count: "1,200+", icon: Landmark },
    { name: "Education", count: "900+", icon: BookOpen },
    { name: "Marketing", count: "750+", icon: ChartCandlestick },
    { name: "Design", count: "600+", icon: PencilRuler },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        {/* <div className="absolute inset-0 bg-[url('/bg2.jpg')] bg-cover bg-center opacity-30"></div> */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Trusted by 50,000+ professionals
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Dream Job
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with top companies, discover amazing opportunities, and
              advance your career with SkillHub's intelligent job matching
              platform.
            </p>

            {/* Enhanced Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs by title, skills, or company..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full pl-12 pr-32 py-4 border border-gray-200 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-r-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                >
                  Search Jobs
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/jobs">
                <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl font-medium text-lg flex items-center gap-2">
                  Explore Jobs
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/post-job">
                <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-medium text-lg">
                  Post a Job
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Job Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore opportunities across various industries and find your
              perfect match
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {jobCategories.map((category, index) => (
              <Link
                key={index}
                href={`/jobs?category=${category.name.toLowerCase()}`}
              >
                <div className="group rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center justify-center mb-3">
                    <category.icon size={40} color="#3884ff" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.count} jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Employers */}
      <TopEmployersSection />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to making your job search and hiring process
              seamless and successful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have found their dream jobs
            through SkillHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl font-medium text-lg">
                Create Free Account
              </button>
            </Link>
            <Link href="/jobs">
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium text-lg">
                Browse Jobs
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <LandPlot className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold">SkillHub</span>
              </div>
              <p className="text-gray-400">
                Connecting talented professionals with amazing opportunities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/jobs"
                    className="hover:text-white transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="hover:text-white transition-colors"
                  >
                    Create Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    My Applications
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/post-job"
                    className="hover:text-white transition-colors"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subscription"
                    className="hover:text-white transition-colors"
                  >
                    Subscription Plans
                  </Link>
                </li>
                <li>
                  <Link
                    href="/employer-dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/info"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} SkillHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
