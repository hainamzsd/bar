'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatTimeDifference } from '@/lib/utils'
import { useFetchReplies } from '@/lib/react-query/commentQueriesAndMutations'
import { CommentFromAPI } from '@/types/comment'
import { useUserContext } from '@/context/AuthContext'
import { ID } from 'appwrite'
import ReplyForm from '../post-related/ReplyForm'
import ReplyList from './Replies'
import RealtimeRepliesListener from './RealtimeRepliesListener'

function Comment({ comment, isReply = false }: { comment: CommentFromAPI; isReply?: boolean }) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replies, setReplies] = useState<CommentFromAPI[]>([])
  const { data, isLoading, fetchNextPage, hasNextPage } = useFetchReplies(comment.$id, comment.post?.$id)
  const { user } = useUserContext()

  useEffect(() => {
    if (data) {
      const allReplies = data.pages.flatMap(page => page.replies)
      setReplies(allReplies)
    }
  }, [data])

  const toggleReplies = () => {
    setShowReplies(!showReplies)
    if (!showReplies && (!data || data.pages[0].replies.length === 0)) {
      fetchNextPage()
    }
  }

  const totalReplies = replies.length
  return (
    <div className={`w-full bg-card text-card-foreground rounded-lg ${isReply ? 'ml-8 mt-2' : ''}`}>
      <div className="">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.creator.imageUrl} alt={comment.creator.username} />
            <AvatarFallback>{comment.creator.username.charAt(0) || 'CN'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{comment.creator.username}</h3>
            </div>
            {comment.content && 
            <p className="text-sm">{comment.content}</p>
            }
            {comment.mediaUrl && (
              <img src={comment.mediaUrl} alt="Comment media" className="mt-2 rounded-md max-w-full h-auto max-h-60 object-cover" />
            )}
            <span className="text-xs text-muted-foreground">{formatTimeDifference(comment.$createdAt)}</span>

            {!isReply && (
              <div className="flex space-x-2 mt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
                  Reply
                </Button>
                {totalReplies > 0 && (
                  <Button variant="ghost" size="sm" onClick={toggleReplies}>
                    {showReplies ? 'Hide replies' : `View ${totalReplies} ${totalReplies === 1 ? 'reply' : 'replies'}`}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        {!isReply && showReplyForm && (
          <ReplyForm user={user} parentComment={comment} postId={comment.post.$id} formId={ID.unique()} />
        )}
      </div>
      {!isReply && showReplies && (
        <>
          <RealtimeRepliesListener parentCommentId={comment.$id} setReplies={setReplies} />
          <ReplyList
            postId={comment.post?.$id}
            replies={replies}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
        </>
      )}
    </div>
  )
}

export default Comment