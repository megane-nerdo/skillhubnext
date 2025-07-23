"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postJobSchema, PostJobFormValues } from "./postJobSchema";

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

import { useState, useEffect } from "react";
import axios from "axios";

export default function PostJobPage() {
  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      title: "",
      salary: "",
      industry: "",
      location: "",
      description: "",
    },
  });

  const [industries, setIndustries] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get("/api/industry");
        setIndustries(res.data);
      } catch (error) {
        console.error("Error fetching industries", error);
      }
    };

    fetchIndustries();
  }, []);

  const onSubmit = async (data: PostJobFormValues) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      console.error("Error posting job:", error);
      return;
    } else {
      console.log("Form submitted:", data);
      form.reset();
    }
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 shadow-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Post a Job
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Frontend Developer"
                      className="bg-white"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-700">Salary</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 800,000 MMK"
                      className="bg-white"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-700">Industry</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-white">
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
                  <FormLabel className="text-gray-700">Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Remote / Yangon / Mandalay"
                      className="bg-white"
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
                  <FormLabel className="text-gray-700">
                    Job Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role, responsibilities, and qualifications..."
                      className="min-h-[120px] bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-4 text-center">
              <Button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 text-base"
              >
                Post Job
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
