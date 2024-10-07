'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeartIcon } from 'lucide-react'
import { useLikePost, useUnlikePost, useHasUserLikedPost, useGetPostLikesCount } from '@/lib/react-query/likeQueriesAndMutations'

type LikeButtonProps = {
  postId: string
  userId: string
}

export function LikeButton({ postId, userId }: LikeButtonProps) {
  const { data: isLiked, isLoading: isLikedLoading } = useHasUserLikedPost(userId, postId)
  const { data: likesCount, isLoading: likesCountLoading } = useGetPostLikesCount(postId)
  const likeMutation = useLikePost()
  const unlikeMutation = useUnlikePost()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleLikeClick = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      if (isLiked) {
        await unlikeMutation.mutateAsync({userId, postId})
      } else {
        await likeMutation.mutateAsync({ userId, postId })
      }
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLikedLoading || likesCountLoading) {
    return <Button variant="ghost" size="sm" disabled>Loading...</Button>
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLikeClick}
      disabled={isUpdating}
    >
      <HeartIcon className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} />
      {likesCount || 0}
    </Button>
  )
}