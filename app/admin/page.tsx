"use client";
import Link from "next/link";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminDashboardPage() {
  const { data: employers } = useSWR("/api/employer", fetcher);
  const { data: jobSeekers } = useSWR("/api/job-seeker", fetcher);
  const { data: categories } = useSWR("/api/category", fetcher);
  const { data: jobs } = useSWR("/api/jobs", fetcher);

  const employerCount = Array.isArray(employers) ? employers.length : 0;
  const jobSeekerCount = Array.isArray(jobSeekers) ? jobSeekers.length : 0;
  const categoryCount = Array.isArray(categories) ? categories.length : 0;
  const jobCount = Array.isArray(jobs) ? jobs.length : 0;

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Employers</CardTitle>
            <CardDescription>Registered employer accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{employerCount}</p>
            <Link
              href="/admin/employer"
              className="text-sm text-blue-600 underline"
            >
              Manage employers
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Job Seekers</CardTitle>
            <CardDescription>Registered job seeker profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{jobSeekerCount}</p>
            <Link
              href="/admin/job-seeker"
              className="text-sm text-blue-600 underline"
            >
              Manage job seekers
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Available job categories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{categoryCount}</p>
            <Link
              href="/admin/category"
              className="text-sm text-blue-600 underline"
            >
              Manage categories
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Jobs</CardTitle>
            <CardDescription>Posted job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{jobCount}</p>
            <Link
              href="/admin/jobs"
              className="text-sm text-blue-600 underline"
            >
              Manage jobs
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
