'use client'

import React, { useState, useRef } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { XIcon, PaperclipIcon, SmileIcon, SendIcon } from 'lucide-react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import vi from '@emoji-mart/data/i18n/vi.json'
import { IComment, IUser } from '@/types'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { addComment } from '@/lib/appwrite/comment-api'
import { useCreateComment } from '@/lib/react-query/commentQueriesAndMutations'
import { useToast } from '@/hooks/use-toast'
import { comment } from 'postcss'
import LoadingButton from '../ui/loading-button'
import { PuffLoader } from 'react-spinners'

const commentFormSchema = z.object({
  content: z.string().min(1),
})

type CommentFormValues = z.infer<typeof commentFormSchema>

interface CommentFormProps {
  user: IUser;
  parentId?: string | null;
  formId: string;
  postId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ user, parentId, formId, postId }) => {
  const [commentImage, setCommentImage] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const commentFileInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast();
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: '',
    },
  })
  const createCommentMutation = useCreateComment();
  async function onSubmit (values: z.infer<typeof commentFormSchema>) {
    try {
      const comment = await createCommentMutation.mutateAsync({
        comment: {
          content: values.content,
          post: postId,
          creator: user.accountId,
          parentId: undefined,
          level: 0,
        },
        mediaFile: commentImage || undefined,
      });

      if (!comment) {
        toast({
          title: `Có lỗi xảy ra vui lòng thử lại sau.`,
          variant: 'destructive'
        });
      }
      form.reset()
      setMediaPreview(null);
      setCommentImage(null);
    } catch (error) {
      console.log(error)
      toast({
        title: `Có lỗi xảy ra`,
        content: `${error}`,
        variant: 'destructive'
      })
    }
  }

  const handleCommentImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      setCommentImage(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  }


  const removeCommentImage = () => {
    setCommentImage(null)
    if (commentFileInputRef.current) {
      commentFileInputRef.current.value = ''
    }
  }

  const addEmoji = (emoji: any) => {
    form.setValue('content', form.getValues('content') + emoji.native, { shouldValidate: true })
    setShowEmojiPicker(false)
  }

  const toggleEmojiPicker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowEmojiPicker(!showEmojiPicker)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start space-x-2">
        <Avatar className="rounded-full w-8 h-8">
          <AvatarImage src={user.imageUrl} alt="Avatar" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>

        <div className="flex-grow space-y-2 max-w-lg mx-auto">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Add a comment..."
                    className="min-h-[60px]"
                    {...field}
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          {commentImage && mediaPreview && (
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
              disabled={createCommentMutation.isPending || form.getValues('content') === ""} // Disable button if loading or explicitly disabled
            >
              {createCommentMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <PuffLoader color="hsl(var(--secondary))" size={20} /> {/* Spinner */}
                </div>
              ) : (
                <>
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">gửi</span></>

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
  )
}

export default CommentForm