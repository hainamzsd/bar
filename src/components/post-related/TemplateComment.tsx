import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { XIcon, PaperclipIcon } from 'lucide-react'

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  replies: Reply[]
  image?: string
}

interface Reply {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  image?: string
}

const dummyComments: Comment[] = [
  // Example comment structure
  {
    id: '1',
    author: 'Jane Doe',
    avatar: '/placeholder.svg?height=32&width=32',
    content: 'This is a comment.',
    timestamp: '2 hours ago',
    likes: 15,
    replies: [],
    image: '/path/to/image.jpg'
  }
]

function Comment({ comment }: { comment: Comment }) {
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-start gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.avatar} alt={`${comment.author}'s avatar`} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex justify-between">
            <p className="font-semibold">{comment.author}</p>
            <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
          </div>
          <p className="mt-1">{comment.content}</p>
          {comment.image && (
            <img src={comment.image} alt="Comment image" className="mt-2 rounded-md max-w-full h-auto" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
            className="mt-2"
          >
            {showReplies ? 'Hide replies' : `View ${comment.replies.length} replies`}
          </Button>
          {showReplies && (
            <div className="ml-8 mt-2 space-y-2">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={reply.avatar} alt={`${reply.author}'s avatar`} />
                    <AvatarFallback>{reply.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">{reply.author}</p>
                      <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                    </div>
                    <p className="mt-1">{reply.content}</p>
                    {reply.image && (
                      <img src={reply.image} alt="Reply image" className="mt-2 rounded-md max-w-full h-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommentList() {
  return (
    <div className="space-y-4">
      {dummyComments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
