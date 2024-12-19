import PostForm from "@/components/posts/PostForm";
import { getPostById } from "@/lib/postSupabse";

interface PostEditPageProps {
  params: {
    id: string;
  };
}

const PostEditPage = async ({ params }: PostEditPageProps) => {
  const { id } = params;
  const post = await getPostById(Number(id))
  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm post={post} categories={[]} tags={[]}/>
    </div>
  );
}

export default PostEditPage;