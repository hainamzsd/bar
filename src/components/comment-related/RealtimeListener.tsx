'use client'

import { useEffect, useRef, useState } from 'react'
import { client, databases, appwriteConfig } from '@/lib/appwrite/config'
import { CommentFromAPI } from '@/types/comment'

function RealtimeListener({ postId, setComments }: { postId: string; setComments: (comments: CommentFromAPI[]) => void }) {
  const hasSubscribedRef = useRef(false)
  const pendingUpdatesRef = useRef<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (hasSubscribedRef.current) return

    hasSubscribedRef.current = true

    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.commentCollectionId}.documents`,
      (response) => {
        console.log(response)
        if (response.events.includes(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.commentCollectionId}.documents.*.create`)) {
          const commentId = (response.payload as { $id: string }).$id
          pendingUpdatesRef.current.push(commentId)
          processUpdates()
        }
      }
    )

    return () => {
      hasSubscribedRef.current = false
      unsubscribe()
    }
  }, [postId])

  const processUpdates = async () => {
    if (isUpdating) return

    setIsUpdating(true)

    const batchSize = 5
    const newComments: CommentFromAPI[] = []

    while (pendingUpdatesRef.current.length > 0 && newComments.length < batchSize) {
      const commentId = pendingUpdatesRef.current.shift()
      if (commentId) {
        try {
          const fullComment = await databases.getDocument(
            appwriteConfig.databaseId as string,
            appwriteConfig.commentCollectionId as string, 
            commentId
          ) 

          if (fullComment.post.$id === postId && !fullComment.parentId) {
            newComments.push(fullComment)
          }
        } catch (error) {
          console.error("Error fetching full comment:", error)
          // Optionally, implement retry logic here
        }
      }
    }

    if (newComments.length > 0) {
      setComments(prevComments => [...newComments, ...prevComments])
    }

    setIsUpdating(false)

    if (pendingUpdatesRef.current.length > 0) {
      setTimeout(processUpdates, 1000) // Process next batch after 1 second
    }
  }

  return null
}

export default RealtimeListener