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
import Head from 'next/head'

type ShareButtonProps = {
  postId: string
  userId: string
  postTitle: string
  postContent: string
  postImage?: string
  authorName: string
  authorAvatar?: string
}

export function ShareButton({ postId, userId, postTitle, postContent, postImage, authorName, authorAvatar }: ShareButtonProps) {
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
      await shareMutation.mutateAsync({ userId, postId, comment })
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

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
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
              placeholder="What's on your mind?"
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
              {shareMutation.isPending ? 'Sharing...' : 'Share now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {userShare && (
        <Button variant="ghost" size="sm" onClick={() => handleUnshare(userShare.$id)} disabled={unshareMutation.isPending}>
          <X className="h-4 w-4 mr-2" />
          {unshareMutation.isPending ? 'Unsharing...' : 'Unshare'}
        </Button>
      )}
      {/* {shares && shares.length > 0 && (
        <div className="mt-4">
          {shares.map((share) => (
            <div key={share.$id} className="flex items-center justify-between mt-2">
              {share.user.$id === userId && (
                <Button variant="ghost" size="sm" onClick={() => handleUnshare(share.$id as string)}>
                  <X className="h-4 w-4 mr-2" />
                  Unshare
                </Button>
              )}
            </div>
          ))}
        </div>
      )} */}
    </>
  )
}