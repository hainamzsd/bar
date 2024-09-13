"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useCreatePost } from "@/lib/react-query/postQueriesAndMutations";
import { ID } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { extractHashtagsAndCleanContent } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";

// Define the Zod schema for validation
const postSchema = z.object({
  caption: z.string().min(3, "Tiêu đề quá ngắn"),
  content: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const highlightHashtags = (text: string) => {
  const parts = text.split(/(#[\w]+)/g); // Split text by hashtags
  return parts.map((part, i) =>
    part.startsWith('#') ? (
      <span key={i} className="text-blue-500">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

export function CreatePost() {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const { user} = useUserContext();
  const {toast} = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: "",
      content: "",
    },
  });

  // Initialize the createPost mutation
  const createPostMutation = useCreatePost(); 

  // Handle media upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  // Remove the uploaded media
  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  // Form submission
  async function onSubmit(values: z.infer<typeof postSchema>) {
    const tags = extractHashtagsAndCleanContent(values.content);
    try{
      const post = await createPostMutation.mutateAsync({
        post: {
          id: ID.unique(),
          creator: user.id,
          caption: values.caption,
          content: tags.content,
          tags: tags.tags
        },
        mediaFile: mediaFile || undefined 
      });
      if(!post){
        toast({
          title: `Tạo bài viết không thành công. Thử lại sau`,
          variant:'destructive'
        });
      }
      toast({
        title: `Tạo bài viết thành công!`,
      });
      router.refresh();
    }catch(error:any){
      toast({
        title:`${error.msg}`,
        variant:'destructive'
      })
    }
  }

  return (
    <Card className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Tạo bài viết mới</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title Field */}
            <FormField
              name="caption"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="caption">Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      id="caption"
                      placeholder="Điền tiêu đề"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content Field */}
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="content">Nội dung</FormLabel>
                  <FormControl>
                    <Input
                      id="content"
                      placeholder="Điền nội dung của bạn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Media Upload */}
            <div className="space-y-2">
              <FormLabel htmlFor="media">Tệp đính kèm</FormLabel>
              <Button
                type="button"
                variant="ghost"
                onClick={() => document.getElementById("media-upload")?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" /> Tải ảnh/video
              </Button>
              <input
                id="media-upload"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleMediaUpload}
              />

              {mediaFile && mediaPreview && (
                <div className="relative mt-4">
                  {mediaFile.type.startsWith("image/") ? (
                    <img
                      src={mediaPreview}
                      alt="Uploaded media preview"
                      className="max-w-60 h-auto object-cover rounded"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      className="w-32 h-32 object-cover rounded"
                      controls
                    />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
          <Button
              type="submit"
              className="w-full"
              disabled={createPostMutation.isPending} // Disable button when loading
            >
              {createPostMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <PuffLoader color="hsl(var(--secondary))" size={20} /> {/* Smaller spinner */}
                  <span>Đang đăng...</span>
                </div>
              ) : (
                "Đăng bài viết"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
