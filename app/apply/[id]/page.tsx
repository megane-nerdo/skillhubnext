"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Building,
  DollarSign,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ApplyJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        setError("Failed to load job details");
      }
    };

    fetchJob();
  }, [id]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await axios.post(`/api/apply/${id}`, {
        coverLetter: data.coverLetter,
      });

      if (res.status === 200) {
        setSuccess(true);
        reset();
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to apply for this job");
    }

    setLoading(false);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Job Details Card */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold mb-2">
                  {job.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-blue-100">
                  {job.employer?.companyName && (
                    <div className="flex items-center gap-1">
                      <Building size={16} />
                      <span>{job.employer.companyName}</span>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>{job.salary}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-blue-100">
                  <Clock size={16} />
                  <span>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {job.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {job.description}
                </p>
              </div>
            )}

            {job.requirements && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Requirements
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {job.requirements}
                </p>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.highlights && job.highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Key Highlights
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.highlights.map((highlight: string, index: number) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Form Card */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="text-blue-600" size={24} />
              Apply for this Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-8">
                <CheckCircle
                  className="text-green-600 mx-auto mb-4"
                  size={48}
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Application Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your application has been sent to the employer.
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label
                    htmlFor="coverLetter"
                    className="text-base font-medium text-gray-900 mb-2 block"
                  >
                    Cover Letter *
                  </Label>
                  <Textarea
                    {...register("coverLetter", {
                      required: "Cover letter is required",
                      minLength: {
                        value: 50,
                        message:
                          "Cover letter must be at least 50 characters long",
                      },
                    })}
                    placeholder="Write a compelling cover letter that highlights your relevant experience and why you're the perfect fit for this role..."
                    className="min-h-[200px] resize-none"
                    rows={8}
                  />
                  {errors.coverLetter && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.coverLetter.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle size={20} />
                      <span className="font-medium">Application Failed</span>
                    </div>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting Application...
                      </div>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-lg font-medium"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
