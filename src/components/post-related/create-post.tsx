"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
import { useUserContext } from "@/context/AuthContext";
import { extractHashtagsAndCleanContent } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingButton from "../ui/loading-button";
import { useMentionSuggestions } from "@/lib/react-query/queriesAndMutations";

const postSchema = z.object({
  caption: z.string().min(3, "Tiêu đề quá ngắn"),
  content: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export function CreatePost() {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useUserContext();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: "",
      content: "",
    },
  });

  const createPostMutation = useCreatePost();

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

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.setValue("content", value);
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

  async function onSubmit(values: z.infer<typeof postSchema>) {
    const tags = extractHashtagsAndCleanContent(values.content);
    try {
      const post = await createPostMutation.mutateAsync({
        post: {
          creator: user.accountId,
          caption: values.caption,
          content: tags.content,
          tags: tags.tags,
        },
        mediaFile: mediaFile || undefined 
      });
      if (!post) {
        toast({
          title: `Tạo bài viết không thành công. Thử lại sau`,
          variant: 'destructive'
        });
      } else {
        toast({
          title: `Tạo bài viết thành công!`,
        });
        router.refresh();
      }
    } catch (error: any) {
      toast({
        title: `${error}`,
        variant: 'destructive'
      });
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

            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="content">Nội dung</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <textarea
                        id="content"
                        placeholder="Điền nội dung của bạn"
                        {...field}
                        onChange={handleContentChange}
                        className="w-full p-2 border rounded"
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
                  <FormMessage />
                </FormItem>
              )}
            />

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
            <LoadingButton
              isLoading={createPostMutation.isPending}
              content="Đăng bài viết"
              loadingText="Đang đăng..."
              disabled={createPostMutation.isPending}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}