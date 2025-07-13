import {z} from 'zod'
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['EMPLOYER', 'JOBSEEKER']),
})

export type RegisterFormValues = z.infer<typeof registerSchema>