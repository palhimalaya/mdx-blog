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
  author: z.string().min(1, "Author is required"),
  content: z.string().min(1, "Content is required"),
});