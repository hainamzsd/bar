'use client';

import { useState } from 'react';
import { Card, CardFooter } from '@/components/ui/card';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import CommentList from './TemplateComment';
import { PostFromAPI } from '@/types/post';
import { useUserContext } from '@/context/AuthContext';
import CommentForm from './CommentForm';
import PostSkeleton from '../skeleton/post-skeleton';
import { useFetchTopLevelComments } from '@/lib/react-query/commentQueriesAndMutations';
import { useUpdatePost, useDeletePost, useGetMentionsByPostId } from '@/lib/react-query/postQueriesAndMutations';
import { ID } from 'appwrite';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

type PostCardProps = {
  post: PostFromAPI;
};

export function PostCard({ post }: PostCardProps) {
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const {data:mentions} = useGetMentionsByPostId(post.$id);
  // Fetching top-level comments for the post
  const { data: topLevelComments, isLoading: loadingTopLevelComments } = useFetchTopLevelComments(post.$id);

  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.$id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          setAlertInfo({ type: 'success', message: 'Post deleted successfully' });
        },
        onError: (error) => {
          console.error('Error deleting post:', error);
          setAlertInfo({ type: 'error', message: 'Failed to delete post. Please try again.' });
        },
      });
    }
  };

  const handleUpdatePost = (updatedData: { caption: string; content?: string }) => {
    updatePost(
      { postId: post.$id, updatedData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['post', post.$id] });
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          setIsEditing(false);
          setAlertInfo({ type: 'success', message: 'Cập nhật bài viết thành công.' });
        },
        onError: (error:any) => {
          console.error('Error updating post:', error);
          setAlertInfo({ type: 'error', message: 'Cập nhật bài viết thất bại. Vui lòng thử lại sau.' });
        },
      }
    );
  };
  return (
    <Card className="w-full">
      {alertInfo && (
        <Alert variant={alertInfo.type === 'success' ? 'default' : 'destructive'}>
          {alertInfo.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{alertInfo.type === 'success' ? 'Thành công' : 'Thất bại'}</AlertTitle>
          <AlertDescription>{alertInfo.message}</AlertDescription>
        </Alert>
      )}
      <PostHeader
        date={post.$createdAt}
        username={post.creator.username}
        avatar={post.creator.imageUrl || ''}
        creatorId={post.creator.accountId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PostContent
        id={post.$id}
        caption={post.caption}
        imageUrl={post.imageUrl}
        content={post.content}
        tags={post.tags}
        author={post.creator.username}
        authorAvatar={post.creator.imageUrl}
        creatorId={post.creator.accountId}
        isEditing={isEditing}
        onUpdate={handleUpdatePost}
        onCancelEdit={() => setIsEditing(false)}
        mentionedUsers={mentions?.map(mention => mention.mentionedUser)}
      />

      <CardFooter className="flex flex-col items-start gap-4">
        <CommentForm user={user} postId={post.$id} formId={ID.unique()} />

        {loadingTopLevelComments ? (
          <PostSkeleton /> 
        ) : (
          <CommentList postId={post.$id}/>
        )}
      </CardFooter>
    </Card>
  );
}