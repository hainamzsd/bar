"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bookmark, ExternalLink, ExternalLinkIcon, Heart, ImageIcon, MessageCircle, SendIcon, Share, Share2, X } from 'lucide-react'
import { useGetUserSavedPosts, useUnsavePost } from '@/lib/react-query/savePostQueriesAndMutations'
import { useHasUserLikedPost, useGetPostLikesCount, useLikePost, useUnlikePost } from '@/lib/react-query/likeQueriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { PostFromAPI } from '@/types/post'
import { IUser } from '@/types'
import { useCommentCount } from '@/lib/react-query/commentQueriesAndMutations'
import { useGetPostSharesCount } from '@/lib/react-query/shareQueiresAndMutations'
import Link from 'next/link'

export function SavedPostsScreen() {
  const { user } = useUserContext()
  const { data: savedPosts, isLoading, error } = useGetUserSavedPosts(user.accountId)
  const unsaveMutation = useUnsavePost()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Saved Posts</h1>
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {savedPosts?.map((post) => (
          <SavedPostCard key={post.post.$id} post={post.post} userId={user.accountId} unsaveMutation={unsaveMutation} />
        ))}
      </motion.div>
    </div>
  )
}

function SavedPostCard({ post, userId, unsaveMutation }: { post: PostFromAPI, userId: string, unsaveMutation: any }) {
  const { data: isLiked } = useHasUserLikedPost(userId, post.$id)
  const { data: likesCount } = useGetPostLikesCount(post.$id)
  const { data: commentCount } = useCommentCount(post.$id)
  const { data: shareCount } = useGetPostSharesCount(post.$id)

  const likeMutation = useLikePost()
  const unlikeMutation = useUnlikePost()

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikeMutation.mutate({ userId, postId: post.$id })
    } else {
      likeMutation.mutate({ userId, postId: post.$id })
    }
  }

  const handleUnsave = () => {
    unsaveMutation.mutate({ userId, postId: post.$id })
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <PostImage imageUrl={post.imageUrl} caption={post.caption} />
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={post.creator.imageUrl} alt={post.creator.username} />
                    <AvatarFallback>{post.creator.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-bold">{post.creator.username}</span>
                </div>
                <p className="text-md line-clamp-2 font-semibold">{post.caption}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
              </div>
            </CardContent>
            <CardFooter className="flex p-4 space-x-6 bg-muted/50">
              <div className="flex items-center space-x-2">
                <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                <span className="text-sm">{likesCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="text-sm">{commentCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span className="text-sm">{shareCount}</span>
              </div>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={post.creator.imageUrl} alt={post.creator.username} />
                <AvatarFallback>{post.creator.username[0]}</AvatarFallback>
              </Avatar>
              {post.creator.username}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <Link href={`/dashboard/post/${post.$id}`} className="group mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 hover:text-blue-500 transition-colors">
                {post.caption}
                <ExternalLinkIcon className="h-4 w-4 transition-opacity" />
              </h2>
            </Link>
            <PostImage imageUrl={post.imageUrl} caption={post.caption} className="w-full h-64 rounded-md mb-4" />
            <p className="mb-4">{post.content}</p>
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" onClick={handleLikeToggle} className="flex items-center space-x-2">
                <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                <span>{likesCount} thích</span>
              </Button>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span>{commentCount} bình luận</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span>{shareCount} chia sẻ</span>
              </div>
            </div>
            <Button variant="outline" onClick={handleUnsave} className="w-full mb-4">
              <Bookmark className="h-5 w-5 mr-2" />
              Huỷ lưu
            </Button>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function PostImage({ imageUrl, caption, className = "" }: { imageUrl?: string, caption: string, className?: string }) {
  if (!imageUrl) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className || 'w-full h-48'}`}>
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No image available</p>
        </div>
      </div>
    )
  }

  return <img src={imageUrl} alt={caption} className={`object-cover ${className || 'w-full h-48'}`} />
}