"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

const postJobSchema = z.object({
  title: z.string().min(1),
  salary: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().min(1),
  description: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  highlights: z.string().optional(),
  careerOpportunities: z.string().optional(),
});

type PostJobFormValues = z.infer<typeof postJobSchema>;

export default function EditJobClient({ job }: { job: any }) {
  const router = useRouter();

  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      title: job.title,
      salary: job.salary || "",
      industry: job.industry?.name || "",
      location: job.location,
      description: job.description,
      requirements: job.requirements || "",
      benefits: job.benefits?.join(", ") || "",
      highlights: job.highlights?.join(", ") || "",
      careerOpportunities: job.careerOpportunities?.join(", ") || "",
    },
  });

  const [industries, setIndustries] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    axios.get("/api/industry").then((res) => setIndustries(res.data));
  }, []);

  const onSubmit = async (data: PostJobFormValues) => {
    const transformedData = {
      ...data,
      // benefits: data.benefits?.split(",").map((item) => item.trim()) ?? [],
      // highlights: data.highlights?.split(",").map((item) => item.trim()) ?? [],
      // careerOpportunities:
      //   data.careerOpportunities?.split(",").map((item) => item.trim()) ?? [],
    };

    try {
      console.log("Submitting job data:", transformedData);
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PUT",
        body: JSON.stringify(transformedData),
      });

      if (!res.ok) throw new Error("Update failed");
      router.push("/employer-dashboard");
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 shadow-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Edit Job
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Salary */}
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 800,000 MMK" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Industry */}
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {industries.map((industry) => (
                          <SelectItem key={industry.id} value={industry.name}>
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Remote / Yangon / Mandalay"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Requirements */}
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Bachelor's degree, 2+ years experience"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Benefits */}
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="School Bus, Health Insurance"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Highlights */}
            <FormField
              control={form.control}
              name="highlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlights (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Fun Environment, Great Team"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Career Opportunities */}
            <FormField
              control={form.control}
              name="careerOpportunities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Opportunities (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Training Provided, Promotion Opportunities"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="pt-4 text-center">
              <Button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 text-base"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
