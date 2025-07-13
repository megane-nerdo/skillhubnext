import { z } from 'zod'

export const postJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

export type PostJobFormValues = z.infer<typeof postJobSchema>
