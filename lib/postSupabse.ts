"use server";

import { supabaseServer } from "@/lib/supabase";
import { PostMetaData } from "@/types/posts";
import { revalidateTag } from "next/cache";
import { handleTags } from "./tagSupabase";

export const getPosts = async () => {
  const { data, error } = await supabaseServer.from('posts').select(
    `
      *,
      categories (name),
      tags (name)
    `
  );
  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
  return data;
};

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabaseServer.from('posts').select('*').match({ slug });
  if (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
  return data[0];
}

export async function getPostById(id: number) {
  const { data, error } = await supabaseServer.from('posts').select('*').match({ id });
  if (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
  return data[0];
}

export async function getPostWithTagsById(id: number) {
  const { data, error } = await supabaseServer.from('posts').select(
    `
      *,
      tags (name)
    `
  ).match({ id }).single();
  console.log(data);
  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
  return data;
}

export async function createPost(post: PostMetaData) {
  const { tags, ...postWithoutTags } = post;

  const { data, error } = await supabaseServer.from('posts').insert([postWithoutTags]).select();
  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  if (data && data[0]) {
    if (post.tags) {
      await handleTags(data[0].id, post.tags.map(tag => tag.name));
    }
  } else {
    throw new Error('Failed to create post: data is null');
  }
  revalidateTag('posts');
  return data;
}

export async function updatePost(post: PostMetaData) {
  const { tags, ...postWithoutTags } = post;
  const { data, error } = await supabaseServer.from('posts').update(postWithoutTags).match({ id: post.id }).select();
  
  if (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }

  if (data && data[0]) {
    if (post.tags) {
      await handleTags(data[0].id, post.tags.map(tag => tag.name));
    }
  } else {
    throw new Error('Failed to update post: data is null');
  }
  revalidateTag('posts');
  return data;
}

export async function deletePost(id: number) {
  const { error } = await supabaseServer.from('posts').delete().match({ id });
  if (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
  revalidateTag('posts');
}
