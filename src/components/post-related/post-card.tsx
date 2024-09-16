'use client';

import { useState } from 'react';
import { Card, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import CommentList from './TemplateComment';
import { PostFromAPI } from '@/types/post';
import { useUserContext } from '@/context/AuthContext';
import CommentForm from './CommentForm';
import PostSkeleton from '../skeleton/post-skeleton';
import { useFetchTopLevelComments } from '@/lib/react-query/commentQueriesAndMutations';
import { ID } from 'appwrite';

type PostCardProps = {
  post: PostFromAPI;
};

export function PostCard({ post }: PostCardProps) {
  const { user } = useUserContext();

  // Fetching top-level comments for the post
  const { data: topLevelComments, isLoading: loadingTopLevelComments } = useFetchTopLevelComments(post.$id);

  return (
    <Card className="w-full">
      <PostHeader
        date={post.$createdAt}
        username={post.creator.username}
        avatar={post.creator.imageUrl}
      />
      <PostContent
      id={post.$id}
        content={post.content}
        title={post.caption}
        imageUrl={post.imageUrl}
        tags={post.tags}
      />

      <CardFooter className="flex flex-col items-start gap-4">
        {/* Comment form for new top-level comment */}
        <CommentForm user={user}
        postId={post.$id}
              formId={ID.unique()}  />

        {/* Display comments or skeleton if loading */}
        {loadingTopLevelComments ? (
          <PostSkeleton /> 
        ) : (
          <CommentList postId={post.$id}/>
        )}
      </CardFooter>
    </Card>
  );
}
