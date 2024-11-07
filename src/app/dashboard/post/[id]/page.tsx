'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPostById } from "@/lib/appwrite/post-api"
import { PostCard } from "@/components/post-related/post-card"
import { useParams } from 'next/navigation'

export default function PostPage() {
  const { id } = useParams() as { id: string }
  const queryClient = useQueryClient()

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id as string),
    staleTime: 0, // Always fetch the latest data
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading post</div>
  if (!post) return <div>Post not found</div>

  return (
    <div className="">
      <PostCard 
        post={post as any} 
        onPostUpdated={() => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['post', id] })
        }}
      />
    </div>
  )
}