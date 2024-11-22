import { TagMetadata } from "./types";

export interface PostMetaData{
  id?: number;
  title?: string;
  image?: string;
  created_at?: string;
  content?: string;
  slug?: string;
  summary?: string;
  author?: string;
  category_id?: number;
  tags?: TagMetadata[];
}

