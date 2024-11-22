import { DataTable } from '@/components/DataTable';
import PostForm from '@/components/posts/PostForm';
import { getPosts } from '@/lib/postSupabse';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { revalidatePath } from 'next/cache';
import PostDataTableClient from './PostDataTableClient';
import { BaseData } from '@/types/types';

export default async function Page() {
  revalidatePath('/admin/posts');
  const posts = await getPosts();
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
      accessorKey: 'summary',
      header: 'Summary',
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
        <PostDataTableClient columns={columns} data={posts} />
    </div>
  );
}