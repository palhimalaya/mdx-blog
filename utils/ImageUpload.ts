import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export const imageUpload = async (file:  File) => {
  const sanitizedFileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
  const uniqueFileName = `${sanitizedFileName}_${Date.now()}`;

  try {
    const { data, error } = await supabase.storage.from('portfolio').upload(uniqueFileName, file);
    if (error) {
      console.error(error);
      throw error;
    } else {
      const fullPath = data?.fullPath
      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${fullPath}`
      return imageUrl;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};