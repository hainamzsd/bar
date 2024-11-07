'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { XIcon, PaperclipIcon, SmileIcon, SendIcon } from 'lucide-react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import vi from '@emoji-mart/data/i18n/vi.json'
import { IUser } from '@/types'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form'
import { useCreateComment } from '@/lib/react-query/commentQueriesAndMutations'
import { useToast } from '@/hooks/use-toast'
import { PuffLoader } from 'react-spinners'
import { useMentionSuggestions } from '@/lib/react-query/queriesAndMutations'

const commentFormSchema = z.object({
  content: z.string().optional(),
})

type CommentFormValues = z.infer<typeof commentFormSchema>

interface CommentFormProps {
  user: IUser;
  parentId?: string | null;
  formId: string;
  postId: string;
  postAuthorId:string;
}

const CommentForm: React.FC<CommentFormProps> = ({ user, parentId, formId, postId,postAuthorId }) => {
  const [commentImage, setCommentImage] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const commentFileInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast();
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: '',
    },
  })
  const createCommentMutation = useCreateComment();

  const {
    data: mentionSuggestionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useMentionSuggestions(mentionQuery, showSuggestions);

  const uniqueMentionSuggestions = useMemo(() => {
    if (!mentionSuggestionsData) return [];
    const uniqueUsers = new Map();
    mentionSuggestionsData.pages.forEach(page => {
      page.users.forEach(user => {
        if (!uniqueUsers.has(user.$id)) {
          uniqueUsers.set(user.$id, user);
        }
      });
    });
    return Array.from(uniqueUsers.values());
  }, [mentionSuggestionsData]);

  useEffect(() => {
    if (showSuggestions) {
      refetch();
    }
  }, [showSuggestions, refetch]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.setValue("content", value, { shouldValidate: true });
    const lastWord = value.split(/\s/).pop() || "";
    if (lastWord.startsWith('@') && lastWord.length > 1) {
      setMentionQuery(lastWord.slice(1));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleUserSelect = (username: string) => {
    const currentContent = form.getValues("content") ?? '';
    const words = currentContent.split(/\s/);
    words[words.length - 1] = `@${username} `;
    form.setValue("content", words.join(' '));
    setShowSuggestions(false);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback((node: HTMLLIElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

  async function onSubmit(values: CommentFormValues) {
    if (!values.content && !commentImage) {
      toast({
        title: "Vui lòng nhập nội dung hoặc đính kèm hình ảnh",
        variant: 'destructive'
      });
      return;
    }
    console.log("created postAUthoridID" + postAuthorId)
    try {
      const comment = await createCommentMutation.mutateAsync({
        comment: {
          content: values.content || '',
          post: postId,
          creator: user.accountId,
          parentId: parentId || undefined,
          level: parentId ? 1 : 0,
        },
        postAuthorId: postAuthorId,
        mediaFile: commentImage || undefined,
      });

      if (!comment) {
        toast({
          title: `Có lỗi xảy ra vui lòng thử lại sau.`,
          variant: 'destructive'
        });
      } else {
        form.reset();
        setMediaPreview(null);
        setCommentImage(null);
      }
    } catch (error) {
      console.log(error)
      toast({
        title: `Có lỗi xảy ra`,
        description: `${error}`,
        variant: 'destructive'
      })
    }
  }

  const handleCommentImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCommentImage(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  }

  const removeCommentImage = () => {
    setCommentImage(null)
    setMediaPreview(null)
    if (commentFileInputRef.current) {
      commentFileInputRef.current.value = ''
    }
  }

  const addEmoji = (emoji: any) => {
    form.setValue('content', (form.getValues('content') || '') + emoji.native, { shouldValidate: true })
    setShowEmojiPicker(false)
  }

  const toggleEmojiPicker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowEmojiPicker(!showEmojiPicker)
  }

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start space-x-2">
          <Avatar className="rounded-full w-8 h-8">
            <AvatarImage src={user.imageUrl} alt="Avatar" />
            <AvatarFallback>{user.username?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>

          <div className="flex-grow space-y-2 w-full mx-auto">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[60px]"
                        {...field}
                        onChange={handleContentChange}
                      />
                      {showSuggestions && uniqueMentionSuggestions.length > 0 && (
                        <ul className="absolute z-10 w-52 mt-1 border rounded shadow-lg max-h-60 overflow-y-auto bg-card text-card-foreground">
                          {uniqueMentionSuggestions.map((user, index) => (
                            <li
                              key={user.$id}
                              ref={index === uniqueMentionSuggestions.length - 1 && hasNextPage ? lastUserElementRef : null}
                              className="p-2 cursor-pointer flex items-center hover:bg-muted"
                              onClick={() => handleUserSelect(user.username)}
                            >
                              <Avatar className="w-8 h-8 mr-2">
                                <AvatarImage src={user.imageUrl} alt={user.username} />
                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              {user.username}
                            </li>
                          ))}
                          {/* {isFetchingNextPage && <li className="p-2 text-center">Loading more...</li>} */}
                        </ul>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {mediaPreview && (
              <div className="relative">
                <img
                  src={mediaPreview}
                  alt="Comment preview"
                  className="mt-2 rounded-md max-w-full h-auto object-cover"
                  style={{ maxHeight: '200px' }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1"
                  onClick={removeCommentImage}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  asChild
                >
                  <label htmlFor={`comment-file-${formId}`}>
                    <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
                    <input
                      id={`comment-file-${formId}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCommentImageUpload}
                      ref={commentFileInputRef}
                    />
                    <span className="sr-only">File đính kèm</span>
                  </label>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleEmojiPicker}
                >
                  <SmileIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">Chọn emoji</span>
                </Button>
              </div>

              <Button
                type="submit"
                size={'icon'}
                disabled={createCommentMutation.isPending || !form.watch('content')}
              >
                {createCommentMutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <PuffLoader color="hsl(var(--secondary))" size={20} />
                  </div>
                ) : (
                  <>
                    <SendIcon className="h-4 w-4" />
                    <span className="sr-only">gửi</span>
                  </>
                )}
              </Button>
            </div>

            {showEmojiPicker && (
              <div className="absolute z-10">
                <Picker i18n={vi} data={data} onEmojiSelect={addEmoji} />
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CommentForm