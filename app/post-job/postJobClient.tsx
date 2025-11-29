"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect, useId } from "react";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  FileText,
  Star,
  CheckCircle,
  Plus,
  ArrowLeft,
  Save,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
// Zod schema
const postJobSchema = z.object({
  title: z.string().min(1),
  salary: z.string().optional(),
  category: z.string().optional(),
  location: z.string().min(1),
  description: z.string().min(1),
  requirements: z.string().optional(),
  benefits: z.string().optional(), // comma-separated string
  highlights: z.string().optional(),
  careerOpportunities: z.string().optional(),
});

type PostJobFormValues = z.infer<typeof postJobSchema>;

export function PostJobClient({
  userId,
  subscription,
}: {
  userId: any;
  subscription: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      title: "",
      salary: "",
      category: "",
      location: "",
      description: "",
      requirements: "",
      benefits: "",
      highlights: "",
      careerOpportunities: "",
    },
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    console.log(`userID = ${userId}`);
    const fetchCategories = async () => {
      try {
        console.log("fetch category");
        const res = await axios.get("/api/category");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: PostJobFormValues) => {
    setIsSubmitting(true);
    try {
      const transformedData = {
        ...data,
        benefits: data.benefits?.split(",").map((item) => item.trim()) ?? [],
        highlights:
          data.highlights?.split(",").map((item) => item.trim()) ?? [],
        carreerOpportunities:
          data.careerOpportunities?.split(",").map((item) => item.trim()) ?? [],
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify(transformedData),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error posting job:", error);
        alert("Failed to post job. Please try again.");
        return;
      }

      console.log("Job posted successfully:", transformedData);
      setIsSuccess(true);
      form.reset();

      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Posted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your job listing has been published and is now visible to job
            seekers.
          </p>
          <div className="flex gap-4">
            <Link
              href="/employer-dashboard"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              View Dashboard
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Post Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/employer-dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Post a New Job
            </h1>
            <p className="text-xl text-gray-600">
              Create an attractive job listing to find the best candidates
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-base font-semibold">
                          Job Title *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Senior Frontend Developer"
                            className="h-12 text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.name}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Location *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Yangon, Remote, Mandalay"
                            className="h-12 text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Salary
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 800,000 - 1,200,000 MMK"
                            className="h-12 text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Job Details Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Job Details
                  </h2>
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Job Description *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                            className="min-h-[120px] text-base resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Requirements
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. Bachelor's degree in Computer Science, 3+ years of React experience, Strong problem-solving skills..."
                            className="min-h-[100px] text-base resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Perks & Benefits Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Star size={20} className="text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Perks & Benefits
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Benefits
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Health Insurance, Paid Time Off, Flexible Hours"
                            className="h-12 text-base"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Separate multiple benefits with commas
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="highlights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Company Highlights
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fun Environment, Great Team, Modern Office"
                            className="h-12 text-base"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Separate multiple highlights with commas
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="careerOpportunities"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-base font-semibold">
                          Career Opportunities
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Training Provided, Promotion Opportunities, Skill Development"
                            className="h-12 text-base"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Separate multiple opportunities with commas
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 text-base"
                  onClick={() => form.reset()}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !subscription.valid}
                  className="flex-1 h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting Job...</span>
                    </div>
                  ) : !subscription.valid ? (
                    <span>Subscribe to Post Job</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save size={20} />
                      <span>Post Job</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            Here are some tips to create an effective job posting:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle
                size={16}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <span>
                Use a clear, specific job title that matches what candidates are
                searching for
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle
                size={16}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <span>
                Write a detailed description that explains the role and company
                culture
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle
                size={16}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <span>List specific requirements and qualifications needed</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle
                size={16}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <span>
                Highlight unique benefits and perks your company offers
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
