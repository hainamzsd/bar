import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { addComment, addReply, fetchCommentCount, fetchReplies, fetchTopLevelComments } from '../appwrite/comment-api'; // Adjust path if needed
import { IComment, IUser } from '@/types';
import { CommentFromAPI } from '@/types/comment';

// Hook to create a comment
export const useCreateComment = () => {
  return useMutation({
    mutationFn: ({ comment, postAuthorId,mediaFile }:
       { comment: IComment, postAuthorId:string, mediaFile?: File }) => 
      addComment(comment, postAuthorId ,mediaFile),
    onSuccess: () => {
      // Optionally, invalidate queries or handle success UI
      
    },
    onError: (error) => {
      console.error("Error creating comment", error);
      throw new Error
    },
  });
};

export const useCreateReply = () => {
  return useMutation({
    mutationFn: ({ parentComment, content, user,mediaFile }: 
      { parentComment: CommentFromAPI, content: string, user: IUser,  mediaFile?: File}) => 
      addReply(parentComment, content, user,mediaFile),
    onSuccess: () => {
      // Optionally invalidate queries or update UI
      
    },
    onError: (error) => {
      console.error("Error creating reply", error);
      throw error;
    },
  });
};
const COMMENTS_PER_PAGE = 4;
  export const useFetchTopLevelComments = (postId: string) => {
    return useInfiniteQuery({
      queryKey: ['topLevelComments', postId],
      queryFn: ({ pageParam = 1 }) => fetchTopLevelComments(postId, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.comments.length === COMMENTS_PER_PAGE ? nextPage : undefined;
      },
      initialPageParam: 1, // Add this line to specify the starting page
      staleTime: 60000, // Cache for 1 minute
    });
  };
  export const useCommentCount = (postId: string) => {
    return useQuery({
      queryKey: ['commentCount', postId],
      queryFn: () => fetchCommentCount(postId),
      staleTime: 60000, // Optional: cache it for 1 minute
    });
  };
  export const useFetchReplies = (parentCommentId: string, postId: string) => {
    return useInfiniteQuery({
      queryKey: ['replies', parentCommentId, postId], // Include postId in queryKey
      queryFn: ({ pageParam = 1 }) => fetchReplies(parentCommentId, postId, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.replies.length === COMMENTS_PER_PAGE ? nextPage : undefined;
      },
      initialPageParam: 1, // Start with page 1
      staleTime: 60000, // Cache for 1 minute
    });
  };