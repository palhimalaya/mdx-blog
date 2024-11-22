'use client';

import React from 'react';
import { DataTable } from '@/components/DataTable';
import { BaseData } from '@/types/types';
import { deletePost } from '@/lib/postSupabse';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from "next/link"

interface DataTableClientProps {
  columns: ColumnDef<BaseData>[];
  data: BaseData[];
}

export default function PostDataTableClient({ columns, data }: DataTableClientProps) {
  const handleDelete = async (post: BaseData) => {
    try {
      await deletePost(post.id);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div>
      <Link href="/admin/posts/create" className='mb-5 flex justify-end'>
        <Button>
            Create Post
        </Button>
      </Link>
      <DataTable
        columns={columns}
        data={data}
        onDelete={handleDelete}
      />
    </div>
  );
}