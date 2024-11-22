import PostsWithSearch from '@/components/posts/PostsWithSearch'
import { getPosts } from '@/lib/postSupabse'
import { revalidatePath } from 'next/cache'

export default async function PostsPage() {
  revalidatePath('/posts')
  const posts = await getPosts()

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <h1 className='title mb-12'>Posts</h1>

        <PostsWithSearch posts={posts} />
      </div>
    </section>
  )
}