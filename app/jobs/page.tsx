"use client";

import { useEffect, useState } from "react";
import { Job, Employer, Category } from "@prisma/client";
import Link from "next/link";
import axios from "axios";
import {
  Search,
  MapPin,
  DollarSign,
  Building2,
  Calendar,
  Filter,
  Briefcase,
  Star,
  Clock,
  Users,
} from "lucide-react";

type JobWithRelations = Job & {
  employer: Employer;
  category: Category | null;
  applications?: any[];
};

export default function JobListPage() {
  const [jobs, setJobs] = useState<JobWithRelations[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithRelations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get("/api/jobs");
      setJobs(res.data);
      setFilteredJobs(res.data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(
          res.data
            .map((job: JobWithRelations) => job.category?.name)
            .filter(Boolean)
        ),
      ];
      setCategories(uniqueCategories as string[]);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = jobs
      .filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.location?.toLowerCase().includes(term) ||
          job.category?.name.toLowerCase().includes(term) ||
          job.employer?.companyName.toLowerCase().includes(term)
      )
      .filter(
        (job) => !selectedCategory || job.category?.name === selectedCategory
      );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing career opportunities from top companies. Your next
            adventure starts here.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by job title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white min-w-[200px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredJobs.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{jobs.length}</span>{" "}
              jobs
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory
                ? "Try adjusting your search criteria or filters"
                : "No job listings available at the moment"}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                View All Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 size={16} className="text-gray-500" />
                      <span className="text-gray-600 font-medium">
                        {job.employer.companyName}
                      </span>
                    </div>
                  </div>
                  {job.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium whitespace-nowrap">
                      {job.category.name}
                    </span>
                  )}
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-gray-600">{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-3">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="text-gray-900 font-semibold">
                        {job.salary} MMK
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-gray-600">Posted recently</span>
                  </div>
                </div>

                {/* Job Description Preview */}
                {job.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {job.description}
                  </p>
                )}

                {/* Job Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {job.applications?.length || 0} applications
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-800">
                    <span className="text-sm font-medium">View Details</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredJobs.length > 0 && filteredJobs.length >= 12 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
