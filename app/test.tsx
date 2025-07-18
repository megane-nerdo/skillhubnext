import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const postJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().optional(),
});

type PostJobFormValues = z.infer<typeof postJobSchema>;
export default function TestPage() {
    const form = useForm<PostJobFormValues>({
        resolver: zodResolver(postJobSchema),
        defaultValues: {
            title: '',
            company: '',
            location: '',
            description: '',
            industry: '',
        }
    });
    return
}
