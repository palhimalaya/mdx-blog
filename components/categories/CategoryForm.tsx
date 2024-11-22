'use client';

import React from 'react';
import * as z from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { categorySchema } from '@/lib/schemas';
import { createCategory } from '@/lib/categorySupabase';
import { CategoryMetadata } from '@/types/types';

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoryForm = ({category}: {category?: CategoryMetadata}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

  const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
    try {
      await createCategory(data);
      toast.success('Category has been added successfully');
      reset();      
    } catch (error) {
      toast.error('Failed to add category');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm max-w-full mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            id="name"
            {...register('name')}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;