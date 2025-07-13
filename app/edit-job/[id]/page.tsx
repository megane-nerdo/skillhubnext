'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postJobSchema, PostJobFormValues } from '../../post-job/postJobSchema'
import { jobs as mockJobs } from '../../lib/mockData'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function EditJobPage({ params }: { params: { id: string } }) {
  const job = mockJobs.find((j) => j.id === params.id)
  const router = useRouter()

  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: job
      ? {
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
        }
      : {
          title: '',
          company: '',
          location: '',
          description: '',
        },
  })

  const onSubmit = (data: PostJobFormValues) => {
    console.log('Edited job:', { ...data, id: params.id })
    alert('Job updated (not persisted)')
    router.push('/employer-dashboard')
  }

  if (!job) {
    return <p className="p-6">Job not found</p>
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="title" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="company" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="location" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="description" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea rows={5} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit">Save Changes</Button>
        </form>
      </Form>
    </main>
  )
}
