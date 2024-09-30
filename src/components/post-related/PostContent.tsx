'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon, XIcon, ExternalLinkIcon } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { LikeButton } from '../LikeButton'
import { useUserContext } from '@/context/AuthContext'
import { useCommentCount } from '@/lib/react-query/commentQueriesAndMutations'

type PostProps = {
  id: string;
  title: string;
  imageUrl?: string;
  content?: string;
  tags?: string[];
};
const highlightHashtagsAndMentions = (content: string) => {
  // Regular expressions for hashtags and mentions
  const hashtagRegex = /#(\w+)/g;
  const mentionRegex = /@(\w+)/g;

  // Split content by spaces, keeping spaces intact
  const parts = content.split(/(\s+)/).map((part, index) => {
    if (hashtagRegex.test(part)) {
      // Highlight hashtags with blue color
      return <span key={index} className="text-blue-500 hover:underline cursor-pointer">{part}</span>;
    } else if (mentionRegex.test(part)) {
      // Highlight mentions using a Badge component
      return <Badge key={index} variant="default" className="mr-1 text-sm">{part}</Badge>;
    }
    return part;
  });

  return <>{parts}</>;
};

export default function PostContent({ id, title, imageUrl, content, tags }: PostProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const {user} = useUserContext();
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)
  const {data,isPending} = useCommentCount(id);
  return (
    <>
      <CardContent className="space-y-4">
        <Link href={`/dashboard/post/${id}`} className="group">
          <h2 className="text-xl font-bold flex items-center gap-2 hover:text-blue-500 transition-colors">
            {title}
            <ExternalLinkIcon className="h-4 w-4 transition-opacity" />
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
        <p className="text-sm">
          {highlightHashtagsAndMentions(content ?? '')}
        </p>
        <div className="flex flex-wrap items-center gap-2">
        <LikeButton postId={id} userId={user.accountId} />
          <Button variant="ghost" size="sm">
            <MessageCircleIcon className="h-4 w-4 mr-2" />
            {data}
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