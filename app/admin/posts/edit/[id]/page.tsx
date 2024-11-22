import PostForm from "@/components/posts/PostForm";
import { getCategories } from "@/lib/categorySupabase";
import { getPostWithTagsById } from "@/lib/postSupabse";
import { getTags } from "@/lib/tagSupabase";
import { PostMetaData } from "@/types/posts";

interface PostEditPageProps {
  params: {
    id: number;
  };
}


const PostEditPage = async ({ params }: PostEditPageProps) => {
  const { id } = params;
  const post: PostMetaData = await getPostWithTagsById(id);
  const categories = await getCategories();
  const tags = await getTags();
  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm post={post} categories={categories} tags={tags}/>
    </div>
  );
}

export default PostEditPage;