import { PostCard } from "@/components/post-related/post-card"
import { getPostById } from "@/lib/appwrite/post-api"

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="">
      <PostCard post={post as any} />
    </div>
  )
}