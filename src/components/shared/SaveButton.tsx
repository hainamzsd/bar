'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookmarkIcon } from 'lucide-react'
import { useSavePost, useUnsavePost, useHasUserSavedPost } from '@/lib/react-query/savePostQueriesAndMutations'

type SaveButtonProps = {
  postId: string
  userId: string
}

export function SaveButton({ postId, userId }: SaveButtonProps) {
  const { data: isSaved, isLoading: isSavedLoading } = useHasUserSavedPost(userId, postId)
  const saveMutation = useSavePost()
  const unsaveMutation = useUnsavePost()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSaveClick = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      if (isSaved) {
        await unsaveMutation.mutateAsync({userId, postId})
      } else {
        await saveMutation.mutateAsync({ userId, postId })
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isSavedLoading) {
    return <Button variant="ghost" size="sm" disabled><BookmarkIcon className="h-4 w-4" /></Button>
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSaveClick}
      disabled={isUpdating}
    >
      <BookmarkIcon className={`h-4 w-4 ${isSaved ? 'fill-current text-blue-500' : ''}`} />
      <span className="sr-only">{isSaved ? 'Unsave post' : 'Save post'}</span>
    </Button>
  )
}