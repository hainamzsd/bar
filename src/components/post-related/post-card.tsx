'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import PostSkeleton from '../skeleton/post-skeleton'
import { PaperclipIcon, XIcon } from 'lucide-react'
import PostHeader from './PostHeader'
import PostContent from './PostContent'
import CommentList from './TemplateComment'
import { useGetAllPosts } from '@/lib/react-query/postQueriesAndMutations'
import { IPost } from '@/types'
import { PostFromAPI } from '@/types/post'

type PostCardProps = {
  post: PostFromAPI;
};


export function PostCard({ post }: PostCardProps) {
  const [commentImage, setCommentImage] = useState<string | null>(null)
  const commentFileInputRef = useRef<HTMLInputElement>(null)



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

  const removeCommentImage = () => {
    setCommentImage(null)
    if (commentFileInputRef.current) {
      commentFileInputRef.current.value = ''
    }
  }
  return (
    <Card className="w-full">
      <PostHeader date={post.$createdAt} username={post.creator.username}
      avatar={post.creator.imageUrl}/>
      <PostContent  content={post.content} title={post.caption} imageUrl={post.imageUrl}
      tags={post.tags}
      />
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
                <img src={commentImage} alt="Comment preview" className="mt-2 rounded-md max-w-full h-auto" />
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
                <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                <input
                  id="comment-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCommentImageUpload}
                  ref={commentFileInputRef}
                />
              </label>
              <Button type="submit" size="sm">Post Comment</Button>
            </div>
          </div>
        </form>
        <CommentList />
      </CardFooter>
    </Card>
  )
}
