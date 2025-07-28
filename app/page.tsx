"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
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

  return (
    <main className="min-h-screen flex flex-col items-center bg-white text-gray-800">
      {/* Hero Section */}
      <section className="w-full  py-16 shadow-sm bg-neutral-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Discover thousands of opportunities that match your skills and
            goals. Whether you’re a job seeker or an employer — we’ve got you
            covered.
          </p>

          {/* 🔍 Search Input */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-md mx-auto mb-10"
          >
            <div className="flex rounded-lg overflow-hidden border border-gray-300 bg-white">
              <input
                type="text"
                placeholder="Search jobs by title, location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow px-4 py-3 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 hover:bg-gray-100 transition text-gray-500 flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs">
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition w-full max-w-[300px] sm:w-auto">
                Explore Jobs
              </button>
            </Link>
            <Link href="/post-job">
              <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition w-full max-w-[300px] sm:w-auto">
                Post a Job
              </button>
            </Link>
          </div>
        </div>
      </section>
      <TopEmployersSection />
      {/* Features Section */}
      <section className="mt-10 max-w-5xl w-full px-4 ">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Why Choose SkillHub?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 shadow rounded-lg border text-center">
            <h3 className="text-xl font-bold mb-2">Easy Application</h3>
            <p className="text-gray-600">
              Apply to jobs with just a few clicks. Upload your resume and get
              started today.
            </p>
          </div>
          <div className="p-6 shadow rounded-lg border text-center">
            <h3 className="text-xl font-bold mb-2">Verified Employers</h3>
            <p className="text-gray-600">
              We verify each employer to ensure a safe and trusted hiring
              experience.
            </p>
          </div>
          <div className="p-6 shadow rounded-lg border text-center">
            <h3 className="text-xl font-bold mb-2">Real-Time Dashboard</h3>
            <p className="text-gray-600">
              Track your applications or manage your job posts in a modern
              dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SkillHub. All rights reserved.
      </footer>
    </main>
  );
}
