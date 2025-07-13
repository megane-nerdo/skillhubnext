'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  applyJobSchema,
  ApplyJobFormValues,
} from '../../lib/validation/applyJobSchema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function ApplyJobPage({ params }: { params: { id: string } }) {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ApplyJobFormValues>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      coverLetter: '',
    },
  })

  const onSubmit = (data: ApplyJobFormValues) => {
    console.log('Applied to job ID:', params.id)
    console.log('Cover Letter:', data.coverLetter)
    setSubmitted(true)
    form.reset()
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Apply for Job ID: {params.id}
      </h1>

      {submitted && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          Successfully applied! (data logged in console)
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Why should we hire you?"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit Application</Button>
        </form>
      </Form>
    </main>
  )
}
