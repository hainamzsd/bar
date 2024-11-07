'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SendIcon, ShareIcon, X } from 'lucide-react'
import { useSharePost, useUnsharePost, useGetPostShares } from '@/lib/react-query/shareQueiresAndMutations'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ShareButtonProps = {
  postId: string
  userId: string
  postTitle: string
  postContent: string
  postImage?: string
  authorName: string
  authorAvatar?: string
  authorId: string
}

export function ShareButton({ postId, userId, postTitle, postContent, postImage, authorName, authorAvatar, authorId }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const { data: shares, isLoading: sharesLoading } = useGetPostShares(postId)
  const shareMutation = useSharePost()
  const unshareMutation = useUnsharePost()

  useEffect(() => {
    if (isOpen) {
      document.body.style.zoom = '1'
    }
  }, [isOpen])

  const handleShare = async () => {
    try {
      await shareMutation.mutateAsync({ userId, postId, authorId, comment })
      setIsOpen(false)
      setComment('')
    } catch (error) {
      console.error("Error sharing post:", error)
    }
  }

  const handleUnshare = async (shareId: string) => {
    try {
      await unshareMutation.mutateAsync({ shareId, postId, userId })
    } catch (error) {
      console.error("Error unsharing post:", error)
    }
  }

  const userShare = shares?.find(share => share.user.$id === userId)
  const isShared = !!userShare

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant={isShared ? "secondary" : "ghost"} 
                  size="sm"
                  className={isShared ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                  disabled={isShared}
                  onClick={() => !isShared && setIsOpen(true)}
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  {shares?.length || 0}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Share this post</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Cảm nghĩ của bạn?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="resize-none text-base"
                    style={{ fontSize: '16px' }}
                  />
                  <Card className="border border-gray-200">
                    <CardHeader className="flex flex-row items-center gap-3 p-4">
                      <Avatar>
                        <AvatarImage src={authorAvatar} alt={authorName} />
                        <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-sm font-semibold">{authorName}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <h2 className="font-semibold mb-2">{postTitle}</h2>
                      <p className="text-sm text-gray-500 line-clamp-2">{postContent}</p>
                      {postImage && (
                        <img src={postImage} alt="Post image" className="mt-2 rounded-md w-full h-40 object-cover" />
                      )}
                    </CardContent>
                  </Card>
                </div>
                <DialogFooter className="sm:justify-between">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleShare} disabled={shareMutation.isPending}>
                    {shareMutation.isPending ? 'Đang chia sẻ...' : 'Chia sẻ ngay'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {isShared && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleUnshare(userShare.$id)} 
                disabled={unshareMutation.isPending}
                className="ml-2"
              >
                <X className="h-4 w-4 mr-2" />
                {unshareMutation.isPending ? 'Đang bỏ chia sẻ...' : 'Huỷ chia sẻ'}
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isShared ? 'Bạn đã chia sẻ bài viết này' : 'Chia sẻ bài viết này'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}