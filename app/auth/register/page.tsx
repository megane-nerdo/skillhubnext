'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { RegisterFormValues, registerSchema } from './schema'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'JOBSEEKER' },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      setError(error.error)
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-600">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="password" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="role" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <select {...field} className="border rounded px-2 py-1 w-full">
                  <option value="JOBSEEKER">Job Seeker</option>
                  <option value="EMPLOYER">Employer</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit">Create Account</Button>
        </form>
      </Form>
    </main>
  )
}
