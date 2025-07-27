import { z } from "zod";

export const postJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  salary: z.string().min(1, "Salary is required"),
  industry: z.string().min(1, "Industry is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().optional(),
  benefits: z.string().optional(), // comma-separated string
  highlights: z.string().optional(),
  careerOpportunities: z.string().optional(),
});

export type PostJobFormValues = z.infer<typeof postJobSchema>;
