"use client";
import { useForm } from "react-hook-form";
import { RegisterFormValues, registerSchema } from "../register/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function Fix() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "JOBSEEKER" },
  });
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await axios.post("/api/register", data);
      console.log("User created", res.data);
      alert("User created successfully");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Error creating user", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>
          <input {...register("name")} placeholder="Your Name" />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} placeholder="Your Email" />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label>Role</label>
          <select {...register("role")}>
            <option value="JOBSEEKER">Job Seeker</option>
            <option value="EMPLOYER">Employer</option>
            {errors.role && <p>{errors.role.message}</p>}
          </select>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Account"}
        </button>
      </form>
    </main>
  );
}
