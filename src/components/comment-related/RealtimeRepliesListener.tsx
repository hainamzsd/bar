'use client'

import { useEffect, useRef } from 'react'
import { CommentFromAPI } from '@/types/comment'
import { appwriteConfig, client, databases } from '@/lib/appwrite/config'

export default function RealtimeRepliesListener({ 
  parentCommentId, 
  setReplies 
}: { 
  parentCommentId: string, 
  setReplies: (updateFn: (prevReplies: any[]) => CommentFromAPI[]) => void 
}) {
  const hasSubscribedRef = useRef(false)

  useEffect(() => {
    if (hasSubscribedRef.current) return

    hasSubscribedRef.current = true

    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.commentCollectionId}.documents`,
      async (response) => {
        console.log("Realtime reply response received:", response)

        if (response.events.includes(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.commentCollectionId}.documents.*.create`)) {
          const replyId = (response.payload as { $id: string }).$id
          console.log("New reply created:", replyId)

          try {
            const fullReply = await databases.getDocument(
              appwriteConfig.databaseId as string,
              appwriteConfig.commentCollectionId as string,
              replyId
            ) 

            console.log("Fetched full reply:", fullReply)

            if (fullReply.parentId === parentCommentId) {
              setReplies((prevReplies) => [fullReply, ...prevReplies])
            }
          } catch (error) {
            console.error("Error fetching full reply:", error)
          }
        }
      }
    )

    return () => {
      hasSubscribedRef.current = false
      unsubscribe()
    }
  }, [parentCommentId, setReplies])

  return null
}