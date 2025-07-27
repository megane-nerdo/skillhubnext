"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Job {
  id: string;
  title: string;
  salary?: string;
  industry?: { name: string };
  location: string;
  description: string;
  benefits?: string[];
  highlights?: string[];
  requirements?: string;
  careerOpportunities?: string[];
  employer: {
    companyName: string;
    companyWebsite?: string;
    companyAddress?: string;
    companyBio?: string;
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
      <div className="text-center mt-20 text-gray-600">
        Loading job details...
      </div>
    );

  const userRole = session?.user?.role ?? null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.salary} Ks</span>
            {job.industry && (
              <>
                <span>•</span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-sm">
                  {job.industry.name}
                </span>
              </>
            )}
          </div>
        </div>

        {userRole === "JOBSEEKER" && (
          <button
            onClick={() => router.push(`/apply/${job.id}`)}
            className="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Apply Now
          </button>
        )}
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Job Info */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </section>

          {job.requirements && (
            <section>
              <h2 className="text-2xl font-semibold mb-2">Requirements</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.requirements}
              </p>
            </section>
          )}

          {(job.benefits?.length ||
            job.highlights?.length ||
            job.careerOpportunities?.length) && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Perks & Growth</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {job.benefits && job.benefits?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800">
                      Benefits
                    </h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {job.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {job.highlights && job.highlights?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800">
                      Highlights
                    </h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {job.highlights.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {job.careerOpportunities &&
                  job.careerOpportunities?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">
                        Career Opportunities
                      </h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {job.careerOpportunities.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </section>
          )}
        </div>

        {/* Right: Employer Info */}
        <aside className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            About the Company
          </h2>
          <p className="font-bold text-gray-900">{job.employer.companyName}</p>
          {job.employer.companyWebsite && (
            <p className="mt-1 text-blue-600 hover:underline">
              <a
                href={job.employer.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                {job.employer.companyWebsite}
              </a>
            </p>
          )}
          {job.employer.companyAddress && (
            <p className="text-gray-700 mt-2">{job.employer.companyAddress}</p>
          )}
          {job.employer.companyBio && (
            <p className="text-gray-700 mt-3 whitespace-pre-wrap">
              {job.employer.companyBio}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
