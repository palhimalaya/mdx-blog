
"use server";

import { supabaseServer } from "@/lib/supabase";
import { CategoryMetadata } from "@/types/types";
import { revalidateTag } from "next/cache";

export const getCategories = async () => {
  const { data, error } = await supabaseServer.from('categories').select('*');
  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
  return data;
};


export const createCategory = async (category: CategoryMetadata) => {
  const { data, error } = await supabaseServer.from('categories').insert(category);
  if (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }
  return data;
}

export const updateCategory = async (category: CategoryMetadata) => {
  const { data, error } = await supabaseServer.from('categories').update(category).match({ id: category.id });
  if (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
  return data;
}

export const deleteCategory = async (id: number) => {
  const { error } = await supabaseServer.from('categories').delete().match({ id });
  if (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
  revalidateTag('categories');
}

export const getCategoryById = async (id: number) => {
  const { data, error } = await supabaseServer.from('categories').select('*').match({ id });
  if (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
  return data[0];
}
