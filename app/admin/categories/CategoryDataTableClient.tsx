'use client';

import React from 'react';
import { CategoryTable } from './CategoryTable';
import { deleteProject } from '@/lib/projectSupabase';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from "next/link"
import { CategoryMetadata } from '@/types/types';

interface DataTableClientProps {
  columns: ColumnDef<CategoryMetadata>[];
  data: CategoryMetadata[];
}

export default function CategoryDataTableClient({ columns, data }: DataTableClientProps) {
  const handleDelete = async (category: CategoryMetadata) => {
    try {
      if (category.id !== undefined) {
        await deleteProject(category.id);
      } else {
        toast.error('Category ID is undefined');
      }
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div>
      <Link href="/admin/categories/create" className='mb-5 flex justify-end'>
        <Button>
            Create Category
        </Button>
      </Link>
      <CategoryTable
        columns={columns}
        data={data}
        onDelete={handleDelete}
      />
    </div>
  );
}