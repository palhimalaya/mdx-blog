import { DataTable } from '@/components/DataTable';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { revalidatePath } from 'next/cache';
import { getProjects } from '@/lib/projectSupabase';
import { Post } from '@/types/posts';
import ProjectDataTableClient from './ProjectDataTableClient';

export default async function Page() {
  revalidatePath('/admin/projects');
  const posts = await getProjects();
  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: 'image',
      header: 'Image',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'author',
      header: 'Author',
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
      <ProjectDataTableClient columns={columns} data={posts} />
    </div>
  );
}