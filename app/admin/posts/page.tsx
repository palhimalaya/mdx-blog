import { DataTable } from '@/components/DataTable';
import PostForm from '@/components/PostForm';
import { getPosts } from '@/lib/postSupabse';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

export default async function Page() {
  const posts = await getPosts();
  
  const columns: ColumnDef<typeof posts[0]>[] = [
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
      <DataTable columns={columns} data={posts} />
      <PostForm />
    </div>
  );
}