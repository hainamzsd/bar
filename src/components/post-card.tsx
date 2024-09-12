'use client'

import { useState, useRef, ChangeEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { BookmarkIcon, HeartIcon, MessageCircleIcon, MoreHorizontalIcon, PaperclipIcon, SendIcon, ChevronDownIcon, XIcon } from "lucide-react"

const MAX_VISIBLE_COMMENTS = 3
const MAX_VISIBLE_REPLIES = 2

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

export function PostCard({ isLoading = false }) {
  const [showReply, setShowReply] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState<string[]>([])
  const [commentImage, setCommentImage] = useState<string | null>(null)
  const [replyImage, setReplyImage] = useState<string | null>(null)
  const commentFileInputRef = useRef<HTMLInputElement>(null)
  const replyFileInputRef = useRef<HTMLInputElement>(null)

  const dummyComments: Comment[] = [
    {
      id: '1',
      author: 'Commenter 1',
      avatar: '/placeholder.svg?height=32&width=32',
      content: 'This is the first comment.',
      timestamp: '1 hour ago',
      likes: 5,
      image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c27dc0a4-6276-4036-968e-51b70613de6d/dfbouue-a609b605-d553-4450-b56e-9cd707317231.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MyN2RjMGE0LTYyNzYtNDAzNi05NjhlLTUxYjcwNjEzZGU2ZFwvZGZib3V1ZS1hNjA5YjYwNS1kNTUzLTQ0NTAtYjU2ZS05Y2Q3MDczMTcyMzEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.49hw3fXDtkGsM1XMh3yk-kwhdUCeRfXTwtdeQnrfuZ0',
      replies: [
        { id: '1-1', author: 'Replier 1', avatar: '/placeholder.svg?height=24&width=24', content: 'This is a reply.', timestamp: '30 minutes ago' },
        { id: '1-2', author: 'Replier 2', avatar: '/placeholder.svg?height=24&width=24', content: 'Another replydawaawawdaw.', timestamp: '15 minutes ago' },
        { id: '1-3', author: 'Replier 3', avatar: '/placeholder.svg?height=24&width=24', content: 'Yet another reply.', timestamp: '5 minutes ago', image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c27dc0a4-6276-4036-968e-51b70613de6d/dfbouue-a609b605-d553-4450-b56e-9cd707317231.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MyN2RjMGE0LTYyNzYtNDAzNi05NjhlLTUxYjcwNjEzZGU2ZFwvZGZib3V1ZS1hNjA5YjYwNS1kNTUzLTQ0NTAtYjU2ZS05Y2Q3MDczMTcyMzEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.49hw3fXDtkGsM1XMh3yk-kwhdUCeRfXTwtdeQnrfuZ0' },
      ]
    },
    {
      id: '2',
      author: 'Commenter 2',
      avatar: '/placeholder.svg?height=32&width=32',
      content: 'This is the second comment.',
      timestamp: '2 hours ago',
      likes: 3,
      replies: []
    },
    {
      id: '3',
      author: 'Commenter 3',
      avatar: '/placeholder.svg?height=32&width=32',
      content: 'This is the third comment.',
      timestamp: '3 hours ago',
      likes: 1,
      replies: []
    },
    {
      id: '4',
      author: 'Commenter 4',
      avatar: '/placeholder.svg?height=32&width=32',
      content: 'This is the fourth comment.',
      timestamp: '4 hours ago',
      likes: 0,
      replies: []
    },
  ]

  const toggleExpandComments = () => {
    setExpandedComments(!expandedComments)
  }

  const toggleExpandReplies = (commentId: string) => {
    setExpandedReplies(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const handleCommentImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCommentImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReplyImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReplyImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeCommentImage = () => {
    setCommentImage(null)
    if (commentFileInputRef.current) {
      commentFileInputRef.current.value = ''
    }
  }

  const removeReplyImage = () => {
    setReplyImage(null)
    if (replyFileInputRef.current) {
      replyFileInputRef.current.value = ''
    }
  }

  const renderComments = () => {
    const commentsToShow = expandedComments ? dummyComments : dummyComments.slice(0, MAX_VISIBLE_COMMENTS)

    return commentsToShow.map((comment) => (
      <div key={comment.id} className="flex items-start space-x-2 mb-4">
        <Avatar className="rounded-full w-8 h-8">
          <AvatarImage src={comment.avatar} alt={`${comment.author}'s avatar`} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="">
          <div className="bg-muted p-2 rounded-md px-5">
            <p className="text-sm font-semibold">{comment.author}</p>
            <p className="text-sm mt-1">{comment.content}</p>
            {comment.image && (
              <img src={comment.image} alt="Comment image" className="mt-2 rounded-md max-w-72 h-auto" />
            )}
            <p className="text-xs text-muted-foreground mt-1">{comment.timestamp}</p>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <Button variant="ghost" size="sm">Like</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReply(showReply === comment.id ? null : comment.id)}>Reply</Button>
          </div>
          {showReply === comment.id && (
            <form className="mt-2 flex items-start space-x-2">
              <Avatar className="rounded-full w-6 h-6">
                <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Your avatar" />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <div className="flex-grow space-y-2">
                <Input placeholder="Write a reply..." />
                {replyImage && (
                  <div className="relative">
                    <img src={replyImage} alt="Reply preview" className="mt-2 rounded-md max-w-full h-auto" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={removeReplyImage}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <label htmlFor={`reply-file-${comment.id}`} className="cursor-pointer">
                    <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                    <input
                      id={`reply-file-${comment.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleReplyImageUpload}
                      ref={replyFileInputRef}
                    />
                  </label>
                  <Button type="submit" size="sm">Reply</Button>
                </div>
              </div>
            </form>
          )}
          {comment.replies.length > 0 && (
            <div className="mt-2 ml-6 space-y-2">
              {(expandedReplies.includes(comment.id) ? comment.replies : comment.replies.slice(0, MAX_VISIBLE_REPLIES)).map((reply) => (
                <div key={reply.id} className="flex items-start space-x-2">
                  <Avatar className="rounded-full w-6 h-6">
                    <AvatarImage src={reply.avatar} alt={`${reply.author}'s avatar`} />
                    <AvatarFallback>{reply.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-sm font-semibold">{reply.author}</p>
                      <p className="text-sm mt-1">{reply.content}</p>
                      {reply.image && (
                        <img src={reply.image} alt="Reply image" className="mt-2 rounded-md max-w-72 h-auto" />
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{reply.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
              {comment.replies.length > MAX_VISIBLE_REPLIES && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleExpandReplies(comment.id)}
                  className="ml-8"
                >
                  {expandedReplies.includes(comment.id) ? 'Show less replies' : `Show ${comment.replies.length - MAX_VISIBLE_REPLIES} more replies`}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    ))
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="rounded-full">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">User Name</p>
          <p className="text-xs text-muted-foreground">2 hours ago</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">Post Title Goes Here</h2>
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c27dc0a4-6276-4036-968e-51b70613de6d/dfbouue-a609b605-d553-4450-b56e-9cd707317231.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MyN2RjMGE0LTYyNzYtNDAzNi05NjhlLTUxYjcwNjEzZGU2ZFwvZGZib3V1ZS1hNjA5YjYwNS1kNTUzLTQ0NTAtYjU2ZS05Y2Q3MDczMTcyMzEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.49hw3fXDtkGsM1XMh3yk-kwhdUCeRfXTwtdeQnrfuZ0"
          alt="Post image"
          className="md:max-w-lg h-auto rounded-md"
        />
        <p className="text-sm">This is the content of the post. It can be a longer text describing the image or sharing thoughts. #hashtag</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm">
            <HeartIcon className="h-4 w-4 mr-2" />
            1.5k
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircleIcon className="h-4 w-4 mr-2" />
            234
          </Button>
          <Button variant="ghost" size="sm">
            <SendIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto">
            <BookmarkIcon className="h-4 w-4" />
            <span className="sr-only">Save post</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <form className="flex w-full items-start space-x-2">
          <Avatar className="rounded-full w-8 h-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="flex-grow space-y-2">
            <Textarea placeholder="Add a comment..." className="min-h-[60px]" />
            {commentImage && (
              <div className="relative">
                <img src={commentImage} alt="Comment preview" className="mt-2 rounded-md max-w-44 h-auto" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1"
                  onClick={removeCommentImage}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex justify-between items-center">
              <label htmlFor="comment-file" className="cursor-pointer">
                <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
                <input
                  id="comment-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCommentImageUpload}
                  ref={commentFileInputRef}
                />
              </label>
              <Button type="submit" size="sm">Post</Button>
            </div>
          </div>
        </form>
        <div className="w-full space-y-4">
          {renderComments()}
          {dummyComments.length > MAX_VISIBLE_COMMENTS && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleExpandComments}
              className="w-full"
            >
              {expandedComments ? 'Show less comments' : `Show ${dummyComments.length - MAX_VISIBLE_COMMENTS} more comments`}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}