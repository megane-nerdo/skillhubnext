import { z } from 'zod'

export const applyJobSchema = z.object({
  coverLetter: z
    .string()
    .min(20, 'Cover letter must be at least 20 characters'),
})

export type ApplyJobFormValues = z.infer<typeof applyJobSchema>
