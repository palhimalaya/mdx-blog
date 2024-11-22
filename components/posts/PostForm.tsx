'use client';

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema } from '@/lib/schemas';
import { Button } from '../ui/button';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { createPost, updatePost } from '@/lib/postSupabse';
import { imageUpload } from '@/utils/ImageUpload';
import { PostMetaData } from '@/types/posts';
import CreatableSelect from 'react-select/creatable';
import { CategoryMetadata, TagMetadata } from '@/types/types';
import { useRouter } from 'next/navigation';



type PostFormValues = z.infer<typeof postSchema>;

type OptionType = {
  value: string;
  label: string;
};

export default function PostForm({ post, categories, tags }: { post?: PostMetaData, categories: CategoryMetadata[], tags: TagMetadata[] }) {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  
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
      title: post?.title || '',
      slug: post?.slug || '',
      summary: post?.summary || '',
      image: post?.image || '',
      content: post?.content || '',
      category_id: post?.category_id,
      tags: post?.tags?.map(tag => tag.name) || [],
    },
  });

  const title = watch('title');
  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        image: post.image,
        content: post.content,
        category_id: post.category_id,
        tags: post.tags?.map(tag => tag.name),
      });
    }
  }, [post, reset, user]);

  useEffect(() => {
    const slug = generateSlug(title);
    setValue('slug', slug);
  }, [title, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setUploading(true);
    try {
      const imageUrl = await imageUpload(file);
      toast.success('Image uploaded successfully');
      setValue('image', imageUrl);
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const processForm: SubmitHandler<PostFormValues> = async data => {
    if (post) {
      if (!post.id) {
        throw new Error('Post ID is required');
      }
      try {
        await updatePost({ 
          ...data, 
          id: post.id, 
          tags: data.tags.map(tag => ({ name: tag }))
        });
        toast.success('Post updated successfully');
        return;
      } catch (error) {
        toast.error('Failed to update post' + (error as any).message);
        console.error(error); 
      }
    }
    else{
      try {
        if(user){
          await createPost({ 
            ...data, 
            author: user.fullName || '',
            tags: data.tags.map(tag => ({ name: tag }))
          });
          reset();
          toast.success('Post created successfully');
          // redirect to post admin page
          router.push('/admin/posts');
          return;
        }else{
          throw new Error('User is required');
        }
      } catch (error) {
        toast.error('Failed to create post' + (error as any).message);
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-8 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm max-w-full mx-auto">
      <form onSubmit={handleSubmit(processForm)} className="space-y-4 w-full" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            id="title"
            autoComplete='title'
            {...register('title')}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
          <input
            id="slug"
            {...register('slug')}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
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
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
          <textarea
            id="summary"
            {...register('summary')}
            rows={3}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
          />
          {errors.summary && <p className="text-red-500 text-sm">{errors.summary.message}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image Upload</label>
          {/* {post && (
            <div className="mt-2 w-32 h-32 relative">
              <Image src={post.image} alt="Uploaded" layout="fill" objectFit="cover" className="rounded-md" />
            </div>
          )} */}
          <input
            type="file"
            id="image"
            onChange={handleImageUpload}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
          />
          {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            id="category_id"
            {...register('category_id', { valueAsNumber: true })}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
          <CreatableSelect
            id="tags"
            isMulti
            defaultValue={post?.tags?.map(tag => ({ value: tag.name, label: tag.name })) || []}
            options={tags.map(tag => ({ value: tag.name, label: tag.name }))}
            onChange={(selectedOptions) => {
              const tags = (selectedOptions as OptionType[]).map(option => option.value);
              setValue('tags', tags);
            }}
            styles={
              {
                control: (styles) => ({
                  ...styles,
                  backgroundColor: 'var(--color-bg)',
                  borderColor: 'var(--color-border)',
                }),
                option: (styles, { isSelected }) => {
                  return {
                    ...styles,
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-bg)',
                    color: isSelected ? 'var(--color-bg)' : 'var(--color-text)',
                  };
                },
                input: (styles) => ({
                  ...styles,
                  color: 'var(--color-text)',
                }),
                menu: (styles) => ({
                  ...styles,
                  backgroundColor: '#0C0C0F',
                  color: 'var(--color-text)',
                })
              }
            }
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
          />
          {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (MDX)</label>
          <textarea
            id="content"
            {...register('content')}
            rows={6}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
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