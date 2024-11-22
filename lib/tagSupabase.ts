
import { supabaseServer } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

type TagMetadata = {
  name: string;
};

export const getTags = async () => {
  const { data, error } = await supabaseServer.from('tags').select('*');
  if (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
  return data;
};

export const createTag = async (tag: TagMetadata) => {
  const { data, error } = await supabaseServer.from('tags').insert(tag).select('*');
  if (error) {
    console.error('Error creating tag:', error);
    throw new Error('Failed to create tag');
  }
  revalidateTag('tags');
  return data;
}

export async function handleTags(postId: number, tags: string[]) {
  const existingTags = await getTags();
  const existingTagNames = existingTags.map(tag => tag.name);
  const newTagNames = tags.filter(tag => !existingTagNames.includes(tag));
  const newTags = await Promise.all(newTagNames.map(name => createTag({ name })));

  const validTags = [...existingTags, ...newTags].filter(tag => tag !== null && tag.id);
  const tagIds = validTags.map(tag => tag.id);

  // Check for existing associations
  const { data: existingAssociations, error: fetchError } = await supabaseServer
    .from('post_tags')
    .select('tag_id')
    .eq('post_id', postId);

  if (fetchError) {
    console.error('Error fetching existing associations:', fetchError);
    throw new Error('Failed to fetch existing post-tag associations');
  }

  const existingTagIds = existingAssociations.map(assoc => assoc.tag_id);
  const newAssociations = tagIds
    .filter(tag_id => !existingTagIds.includes(tag_id))
    .map(tag_id => ({ post_id: postId, tag_id }));

  if (newAssociations.length > 0) {
    const { data, error } = await supabaseServer.from('post_tags').insert(newAssociations);
    if (error) {
      console.error('Error creating post-tag associations:', error);
      throw new Error('Failed to create post-tag associations');
    }
  }

  revalidateTag('tags');
  return newAssociations;
}