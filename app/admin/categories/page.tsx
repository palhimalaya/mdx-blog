import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { revalidatePath } from 'next/cache';
import CategoryDataTableClient from './CategoryDataTableClient';
import { CategoryMetadata } from '@/types/types';
import { getCategories } from '@/lib/categorySupabase';

export default async function Page() {
  revalidatePath('/admin/projects');
  const categories = await getCategories();
  const columns: ColumnDef<CategoryMetadata>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'created_at',
      header: 'Published At',
    },
    {
      id: 'actions',
      header: '',
    },
  ];

  return (
    <div className='w-full'>
      <CategoryDataTableClient columns={columns} data={categories} />
    </div>
  );
}