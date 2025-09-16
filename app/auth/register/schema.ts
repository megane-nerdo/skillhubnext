import { z } from "zod";
export const registerSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password should be at least 6 characters"),
  role: z.enum(
    ["EMPLOYER", "JOBSEEKER"],
    "Role must be either EMPLOYER or JOBSEEKER"
  ),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
