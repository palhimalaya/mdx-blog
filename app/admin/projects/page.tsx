import { DataTable } from '@/components/DataTable';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { revalidatePath } from 'next/cache';
import { getProjects } from '@/lib/projectSupabase';
import ProjectDataTableClient from './ProjectDataTableClient';
import { BaseData } from '@/types/types';

export default async function Page() {
  revalidatePath('/admin/projects');
  const projects = await getProjects();
  const columns: ColumnDef<BaseData>[] = [
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
      <ProjectDataTableClient columns={columns} data={projects} />
    </div>
  );
}