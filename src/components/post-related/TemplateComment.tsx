'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateReply, useFetchReplies, useFetchTopLevelComments } from '@/lib/react-query/commentQueriesAndMutations'
import { CommentFromAPI } from '@/types/comment'
import { formatTimeDifference } from '@/lib/utils'
import { addReply } from '@/lib/appwrite/comment-api'
import CommentForm from './CommentForm'
import { useUserContext } from '@/context/AuthContext'
import { ID } from 'appwrite'


function Comment({ comment }: { comment: CommentFromAPI }) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const { data: replies, isLoading, refetch } = useFetchReplies(comment.$id)
  const { user } = useUserContext()

  return (
    <div className="w-full bg-card text-card-foreground rounded-lg shadow-sm">
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={comment.creator.imageUrl} alt={comment.creator.username} />
            <AvatarFallback>{comment.creator.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 ">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{comment.creator.username}</h3>
            </div>
            <p className="text-sm">{comment.content}</p>
            <span className="text-sm text-muted-foreground">{formatTimeDifference(comment.$createdAt)}</span>
            {comment.mediaUrl && (
              <img src={comment.mediaUrl} alt="Comment media" className="mt-2 rounded-md max-w-full h-auto" />
            )}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Reply
              </Button>
              {replies && replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? 'Hide replies' : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
                </Button>
              )}
            </div>
          </div>
        </div>
        {showReplyForm && (
          <div className="mt-2">
            <CommentForm parentId={comment.$id} user={user} postId={'daw'}
              formId={ID.unique()}/>
          </div>
        )}
      </div>
      
      {showReplies && (
        <div className="ml-12 space-y-4 p-4 bg-muted rounded-b-lg">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading replies...</p>
          ) : (
            replies?.map((reply) => (
              <Comment key={reply.$id} comment={reply as any} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
export default function CommentList({ postId }: {postId: string}) {
  const { data: comments, isLoading } = useFetchTopLevelComments(postId)

  if (isLoading) {
    return <div className="text-center">Loading comments...</div>
  }

  if (!comments || comments.length === 0) {
    return <div className="text-center">No comments yet.</div>
  }

  return (
    <div className="space-y-6 w-full">
      {comments.map((comment) => (
        <Comment key={comment.$id} comment={comment as any} />
      ))}
    </div>
  )
}