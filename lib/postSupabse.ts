"use server"

import { supabaseServer } from "@/lib/superbase"

type PostMetadata = {
  title?: string
  summary?: string
  image?: string
  author?: string
  publishedAt?: string
  slug: string
}

export async function getPosts() {
  const { data, error } = await supabaseServer.from('posts').select('*');

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }

  return data;
}

export async function getPost(slug: string) {
  const { data, error } = await supabaseServer.from('posts').select('*').match({ slug });

  if (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }

  return data[0];
}

export async function createPost(post: PostMetadata) {
  const { data, error } = await supabaseServer.from('posts').insert([post]);

  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  return data;
}

export async function updatePost(post: PostMetadata) {
  const { data, error } = await supabaseServer.from('posts').update(post).match({ slug: post.slug });

  if (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }

  return data;
}

export async function deletePost(slug: string) {
  const { error } = await supabaseServer.from('posts').delete().match({ slug });

  if (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
}
