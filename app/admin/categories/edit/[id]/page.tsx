import CategoryForm from "@/components/categories/CategoryForm";
import { getCategoryById } from "@/lib/categorySupabase";

interface PostEditPageProps {
  params: {
    id: number;
  };
}

const PostEditPage = async ({ params }: PostEditPageProps) => {
  const { id } = params;
  const category = await getCategoryById(id)
  return (
    <div>
      <h1>Edit Post</h1>
      <CategoryForm category={category}/>
    </div>
  );
}

export default PostEditPage;