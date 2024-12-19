import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .min(2, { message: 'Must be at least 2 characters.' }),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email('Invalid email.'),
  message: z.string().min(1, { message: 'Message is required.' })
})

export const NewsletterFormSchema = z.object({
  email: z.string().email('Invalid email.')
})

export const UserRoleFormSchema = z.object({
  id: z.string(),
  role: z.enum(['admin', 'moderator', 'user']),
});

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().min(1, "Summary is required"),
  image: z.string().url("Invalid image URL"),
  content: z.string().min(1, "Content is required"),
  category_id: z.number().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().min(1, "Summary is required"),
  image: z.string().url("Invalid image URL"),
  content: z.string().min(1, "Content is required"),
  category_id: z.number().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});