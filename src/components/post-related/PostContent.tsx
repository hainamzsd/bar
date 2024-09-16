'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon, XIcon, ExternalLinkIcon } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { highlightHashtags } from '@/lib/utils'
import Link from 'next/link'

type PostProps = {
  id: string;
  title: string;
  imageUrl?: string;
  content?: string;
  tags?: string[];
};

export default function PostContent({ id, title, imageUrl, content, tags }: PostProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  return (
    <>
      <CardContent className="space-y-4">
        <Link href={`/dashboard/post/${id}`} className="group">
          <h2 className="text-xl font-bold flex items-center gap-2 hover:text-blue-500 transition-colors">
            {title}
            <ExternalLinkIcon className="h-4 w-4  transition-opacity" />
          </h2>
        </Link>
        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Post image"
              className="w-full md:max-w-lg h-auto rounded-md cursor-pointer"
              onClick={toggleFullscreen}
            />
          </div>
        )}
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: highlightHashtags(content ?? '', tags ?? []) }} />
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

      {isFullscreen && imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={toggleFullscreen}
          >
            <XIcon className="h-6 w-6" />
          </Button>
          <img
            src={imageUrl}
            alt="Fullscreen post image"
            className="max-h-full max-w-full object-contain"
            onClick={toggleFullscreen}
          />
        </div>
      )}
    </>
  )
}