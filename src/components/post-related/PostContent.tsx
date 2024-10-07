'use client'

import { use, useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon, XIcon, ExternalLinkIcon } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { LikeButton } from '../shared/LikeButton'
import { useUserContext } from '@/context/AuthContext'
import { useCommentCount } from '@/lib/react-query/commentQueriesAndMutations'
import { SaveButton } from '../shared/SaveButton'
import { ShareButton } from '../shared/ShareButton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useGetUserByAccountId } from '@/lib/react-query/queriesAndMutations'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

type PostProps = {
  id: string;
  title: string;
  imageUrl?: string;
  content?: string;
  tags?: string[];
  author: string;
  authorAvatar?: string;
  creatorId: string;
  isEditing: boolean;
  onUpdate: (data: { title: string; content: string }) => void;
  onCancelEdit: () => void;
  mentionedUsers?: any[];
};



function MiniProfile({ id }: { id: string }) {
  const { data: userData, isLoading, error } = useGetUserByAccountId(id);

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading profile</div>

  return (
    <div className="flex items-center space-x-4 p-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={userData.imageUrl} alt={userData.username} />
        <AvatarFallback>{userData.username[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-bold">{userData.username}</h3>
        <p className="text-sm text-muted-foreground">{userData.bio}</p>
        <div className="mt-2 flex space-x-2 text-sm">
          <span>0 followers</span>
          <span>0 following</span>
        </div>
      </div>
    </div>
  )
}

function MentionPopover({ children, id }: { children: React.ReactNode, id: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer">{children}</span>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <MiniProfile id={id} />
      </PopoverContent>
    </Popover>
  )
}

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be 1000 characters or less'),
});

export default function PostContent({ id, title, imageUrl, content, tags, author, authorAvatar, creatorId, isEditing, onUpdate, onCancelEdit, mentionedUsers }: PostProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { user } = useUserContext();
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)
  const { data: commentCount, isPending } = useCommentCount(id);
  const highlightMentions = (content: string) => {
    const mentionRegex = /@(\w+)/g;
    console.log(mentionedUsers)
    const parts = content.split(/(\s+)/).map((part, index) => {
      const username = part.slice(1); // Remove the @ symbol
      const mentionedUser = mentionedUsers?.find(user => user.username === username);
      if (mentionedUser) {
        return (
          <MentionPopover key={index} id={mentionedUser.accountId}>
            <Badge variant="default" className="mr-1 text-sm">@{mentionedUser.username}</Badge>
          </MentionPopover>
        );
      }
    });
    return <>{parts}</>;
  };
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: title,
      content: content || '',
    },
  });

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    onUpdate(values);
  };

  return (
    <>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={onCancelEdit}>Cancel</Button>
            </form>
          </Form>
        ) : (
          <>
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
              { highlightMentions(content ?? '')}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <LikeButton postId={id} userId={user.accountId} />
              <Button variant="ghost" size="sm">
                <MessageCircleIcon className="h-4 w-4 mr-2" />
                {commentCount}
              </Button>
              <ShareButton 
                postId={id} 
                userId={user.accountId}
                postTitle={title}
                postContent={content ?? ''}
                postImage={imageUrl}
                authorName={author}
                authorAvatar={authorAvatar}
              />
              <div className="ml-auto">
                <SaveButton postId={id} userId={user.accountId} />
              </div>
            </div>
          </>
        )}
      </CardContent>

      {isFullscreen && imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={toggleFullscreen}
          >
            <XIcon className="h-6 w-4" />
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