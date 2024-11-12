import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import data from '@emoji-mart/data'
import vi from '@emoji-mart/data/i18n/vi.json'
import { useCreateReply } from '@/lib/react-query/commentQueriesAndMutations';
import { IUser } from '@/types';
import { CommentFromAPI } from '@/types/comment';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { PaperclipIcon, SendIcon, SmileIcon, XIcon } from 'lucide-react';
import Picker from '@emoji-mart/react'
import { PuffLoader } from 'react-spinners';
interface ReplyFormProps {
    parentComment: CommentFromAPI, // Parent comment ID
    user: IUser
  postId: string;
  formId: string;
  postAuthorId:string;
}
const commentFormSchema = z.object({
    content: z.string().optional(),
  })
  
  type CommentFormValues = z.infer<typeof commentFormSchema>
const ReplyForm: React.FC<ReplyFormProps> = ({ parentComment, user,postId,formId,postAuthorId}) => {
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentFileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: '',
    },
  });
  const createReplyMutation = useCreateReply(); // Using the new hook

  async function onSubmit(values: CommentFormValues) {
    if (!values.content && !commentImage) {
      toast({
        title: "Vui lòng nhập nội dung hoặc đính kèm hình ảnh",
        variant: 'destructive',
      });
      return;
    }

    try {
      const reply = await createReplyMutation.mutateAsync({
        parentComment: parentComment,
        content: values.content || '',
        user: user,
        postAuthorId:postAuthorId,
        mediaFile:commentImage || undefined
      });

      if (!reply) {
        toast({
          title: `Có lỗi xảy ra vui lòng thử lại sau.`,
          variant: 'destructive',
        });
      } else {
        form.reset();
        setMediaPreview(null);
        setCommentImage(null);
      }
    } catch (error) {
      
      toast({
        title: `Có lỗi xảy ra`,
        description: `${error}`,
        variant: 'destructive',
      });
    }
  }

  const handleCommentImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCommentImage(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const removeCommentImage = () => {
    setCommentImage(null);
    setMediaPreview(null);
    if (commentFileInputRef.current) {
      commentFileInputRef.current.value = '';
    }
  };

  const toggleEmojiPicker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowEmojiPicker(!showEmojiPicker);
  };

  const addEmoji = (emoji: any) => {
    form.setValue('content', (form.getValues('content') || '') + emoji.native, { shouldValidate: true })
    setShowEmojiPicker(false)
  }
  return (
    <div className="max-w-lg ml-8"> {/* Indent the reply */}
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
                    <Textarea
                      placeholder="Phản hồi bình luận..."
                      className="min-h-[60px]"
                      {...field}
                    />
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
                  asChild
                >
                  <label htmlFor={`reply-file-${formId}`}>
                    <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
                    <input
                      id={`reply-file-${formId}`}
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
                disabled={createReplyMutation.isPending || (!form.getValues('content') && !commentImage)}
              >
                {createReplyMutation.isPending ? (
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
  );
};

export default ReplyForm;
