import { useMutation, useQuery } from '@tanstack/react-query';
import { addComment, addReply, fetchReplies, fetchTopLevelComments } from '../appwrite/comment-api'; // Adjust path if needed
import { IComment, IUser } from '@/types';
import { CommentFromAPI } from '@/types/comment';

// Hook to create a comment
export const useCreateComment = () => {
  return useMutation({
    mutationFn: ({ comment, mediaFile }:
       { comment: IComment, mediaFile?: File }) => 
      addComment(comment,mediaFile),
    onSuccess: () => {
      // Optionally, invalidate queries or handle success UI
      console.log("Comment created successfully");
    },
    onError: (error) => {
      console.error("Error creating comment", error);
      throw new Error
    },
  });
};

export const useCreateReply = () => {
    return useMutation({
      mutationFn: ({ parentComment, content, user }: { parentComment:CommentFromAPI, content: string, user: IUser }) => addReply(parentComment, content, user),
      onSuccess: () => {
        // Optionally, invalidate queries or handle success UI
        console.log("Reply created successfully");
      },
      onError: (error) => {
        console.error("Error creating reply", error);
      },
    });
  };

  export const useFetchTopLevelComments = (postId: string) => {
    return useQuery({
      queryKey: ['topLevelComments', postId],
      queryFn: () => fetchTopLevelComments(postId),
      staleTime: 60000, // Cache for 1 minute
    });
  };
  export const useFetchReplies = (parentCommentId: string) => {
    return useQuery({
      queryKey: ['replies', parentCommentId],
      queryFn: () => fetchReplies(parentCommentId),
    });
  };
  
