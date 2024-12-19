"use server";

import { supabaseServer } from "@/lib/supabase";
import { ProjectMetaData } from "@/types/projects";
import { revalidateTag } from "next/cache";
import { handleProjectTags } from "./tagSupabase";

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

export async function createProject(project: ProjectMetaData) {
  const { tags, ...projectWithoutTags } = project;
  const { data, error } = await supabaseServer.from('projects').insert([projectWithoutTags]).select();
  if (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
  
  if (data && data[0]) {
    if (project.tags) {
      await handleProjectTags(data[0].id, project.tags.map(tag => tag.name));
    }
  } else {
    throw new Error('Failed to create project: data is null');
  }
  revalidateTag('posts');
  return data;
}

export async function updateProject(project: ProjectMetaData) {
  const { tags, ...projectWithoutTags } = project;
  const { data, error } = await supabaseServer.from('projects').update(projectWithoutTags).match({ id: project.id }).select();
  if (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }

  if (data && data[0]) {
    if (project.tags) {
      await handleProjectTags(data[0].id, project.tags.map(tag => tag.name));
    }
  } else {
    throw new Error('Failed to create project: data is null');
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
