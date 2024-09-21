'use client';

import React, { useEffect } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema } from '@/lib/schemas';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { createPost } from '@/lib/postSupabse';

type PostFormValues = z.infer<typeof postSchema>;

export default function PostForm() {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      image: '',
      author: '',
      content: '',
    }
  });

  const title = watch('title');

  useEffect(() => {
    if (user) {
      reset({
        title: '',
        slug: '',
        summary: '',
        image: '',
        author: user.fullName ?? '',
        content: '',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    const slug = generateSlug(title);
    setValue('slug', slug);
  }, [title, setValue]);

  const processForm: SubmitHandler<PostFormValues> = async data => {
    try {
      await createPost(data);
      reset();
      toast.success('Post created successfully')
    } catch (error) {
      toast.error('Failed to create post')
      console.error(error)
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(processForm)} className="space-y-4 max-w-lg mx-auto" noValidate>
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            autoComplete='title'
            {...register('title')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            id="slug"
            {...register('slug')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              const value = e.target.value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
              setValue('slug', value);
            }}
          />
          {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
          <textarea
            id="summary"
            {...register('summary')}
            rows={3}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.summary && <p className="text-red-500 text-sm">{errors.summary.message}</p>}
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            id="image"
            {...register('image')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input
            disabled
            id="author"
            {...register('author')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (MDX)</label>
          <textarea
            id="content"
            {...register('content')}
            rows={6}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full disabled:opacity-50'
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
        </div>
      </form>
    </div>
  );
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}