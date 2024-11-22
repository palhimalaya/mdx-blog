"use server";

import { supabaseServer } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

type ProjectMetadata = {
  id?: number;
  title?: string;
  summary?: string;
  image?: string;
  author?: string;
  publishedAt?: string;
  slug: string;
};

export const getProjects = async () => {
  const { data, error } = await supabaseServer.from('projects').select('*');
  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
  return data;
};

export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabaseServer.from('projects').select('*').match({ slug });
  if (error) {
    console.error('Error fetching project:', error);
    throw new Error('Failed to fetch project');
  }
  return data[0];
}

export async function createProject(project: ProjectMetadata) {
  const { data, error } = await supabaseServer.from('projects').insert([project]);
  if (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
  revalidateTag('projects');
  return data;
}

export async function updateProject(project: ProjectMetadata) {
  const { data, error } = await supabaseServer.from('projects').update(project).match({ id: project.id });
  if (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
  revalidateTag('projects');
  return data;
}

export async function deleteProject(id: number) {
  const { error } = await supabaseServer.from('projects').delete().match({ id });
  if (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
  revalidateTag('projects');
}

export async function uploadImage(file: File) {
  const { data, error } = await supabaseServer.storage.from('portfolio').upload(file.name, file);
  console.log(data,error)
  if (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
  return data;
}
