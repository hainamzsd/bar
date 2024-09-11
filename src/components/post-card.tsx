  'use client'

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookmarkIcon, HeartIcon, MessageCircleIcon, MoreHorizontalIcon, PaperclipIcon, SendIcon } from "lucide-react"

export function PostCard() {
  const [showReply, setShowReply] = useState(false)

  return (
    <Card className="w-full max-w-2xl mx-auto">
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
          src="/placeholder.svg?height=300&width=400"
          alt="Post image"
          className="w-full h-auto rounded-md"
        />
        <p className="text-sm">This is the content of the post. It can be a longer text describing the image or sharing thoughts. #hashtag</p>
        <div className="flex items-center gap-2">
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
            <div className="flex justify-between items-center">
              <label htmlFor="comment-file" className="cursor-pointer">
                <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
                <input id="comment-file" type="file" className="hidden" />
              </label>
              <Button type="submit" size="sm">Post</Button>
            </div>
          </div>
        </form>
        <div className="w-full space-y-4">
          <div className="flex items-start space-x-2">
            <Avatar className="rounded-full w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Commenter avatar" />
              <AvatarFallback>CA</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="bg-muted p-2 rounded-md">
                <p className="text-sm font-semibold">Commenter Name</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
                <p className="text-sm mt-1">This is a sample comment on the post. It can be a reaction or a question about the content.</p>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <Button variant="ghost" size="sm">Like</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowReply(!showReply)}>Reply</Button>
              </div>
              {showReply && (
                <form className="mt-2 flex items-start space-x-2">
                  <Avatar className="rounded-full w-6 h-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Your avatar" />
                    <AvatarFallback>YA</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow space-y-2">
                    <Input placeholder="Write a reply..." />
                    <div className="flex justify-between items-center">
                      <label htmlFor="reply-file" className="cursor-pointer">
                        <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                        <input id="reply-file" type="file" className="hidden" />
                      </label>
                      <Button type="submit" size="sm">Reply</Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}