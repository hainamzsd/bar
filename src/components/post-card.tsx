  'use client'

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookmarkIcon, HeartIcon, MessageCircleIcon, MoreHorizontalIcon, PaperclipIcon, SendIcon } from "lucide-react"
import Image from "next/image"

export function PostCard() {
  const [showReply, setShowReply] = useState(false)

  return (
    <Card className="w-full ">
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
                <p className="text-sm mt-1">This is a sample comment on the post. It can be a reaction or a question about the content.</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
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