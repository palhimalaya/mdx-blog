import PostForm from '@/components/posts/PostForm';
import { getCategories } from '@/lib/categorySupabase';
import { getTags } from '@/lib/tagSupabase';
import React from 'react';
export default async function Page() {
  const categories = await getCategories();
  const tags = await getTags();
  return (
    <div className='w-full'>
      <PostForm categories={categories} tags={tags}/>
    </div>
  );
}