import { Button } from '@/components/ui/button'
import { CommentFromAPI } from '@/types/comment'
import Comment from './Comments'

function ReplyList({
  replies,
  isLoading,
  hasNextPage,
  fetchNextPage,
}: {
  replies: CommentFromAPI[]
  isLoading: boolean
  hasNextPage: boolean | undefined
  fetchNextPage: () => void
}) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading replies...</p>
  }

  return (
    <div className="ml-8 space-y-2 p-2 rounded-b-lg">
      {replies.map(reply => (
        <Comment key={reply.$id} comment={reply} isReply={true} />
      ))}
      {hasNextPage && (
        <div className="text-center mt-4">
          <Button onClick={fetchNextPage} variant="outline">
            Load More Replies
          </Button>
        </div>
      )}
    </div>
  )
}

export default ReplyList