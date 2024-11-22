export interface BaseData {
  id: number;
  title: string;
  image: string;
  created_at: string;
  content: string;
  slug: string;
  summary: string;
  author: string;
}

export type CategoryMetadata = {
  id?: number;
  name: string;
  description?: string;
};

export type TagMetadata = {
  id?: number;
  name: string;
};
