'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postJobSchema, PostJobFormValues } from './postJobSchema'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/form'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function PostJobPage() {
  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      title: '',
      salary: '',
      industry: '',
      location: '',
      description: '',
    },
  })
  
  const [industries, setIndustries] = useState<{ id: string; name: string }[]>([])

useEffect(() => {
  const fetchIndustries = async () => {
    try {
      const res = await axios.get('/api/industry')
      setIndustries(res.data)
    } catch (error) {
      console.error('Error fetching industries', error)
    }
  }

  fetchIndustries()
}, [])


  const onSubmit = async (data: PostJobFormValues) => {
    console.log('Submitting job:', data)
    const res = await fetch('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json()
      console.error('Error posting job:', error)
      return
    }
    else{
      console.log('Form submitted:', data)
      form.reset()
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Post a Job</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input placeholder= ".....Kyats" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
  control={form.control}
  name="industry"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Industry</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {industries.map((industry) => (
            <SelectItem key={industry.id} value={industry.name}>
              {industry.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>


          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Remote / Yangon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the role and requirements"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Post Job</Button>
        </form>
      </Form>
    </main>
  )
}
