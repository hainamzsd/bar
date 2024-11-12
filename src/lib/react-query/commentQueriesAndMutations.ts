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
    /**
     * Creates a reply to the given parent comment. The reply's content will be
     * sent to the server, as well as the user who is making the reply and the
     * post author ID.
     * 
     * @param {CommentFromAPI} parentComment The parent comment to which this
     * reply is being made.
     * @param {string} content The content of the reply.
     * @param {IUser} user The user who is making the reply.
     * @param {string} postAuthorId The ID of the author of the post to which
     * this comment is being replied.
     * @param {File} [mediaFile] An optional file to upload. If provided, the
     * file will be uploaded and the server will return the URL of the uploaded
     * file.
     */
    mutationFn: ({ parentComment, content, user, postAuthorId,mediaFile }: 
      { parentComment: CommentFromAPI, content: string, user: IUser, postAuthorId:string,mediaFile?: File}) => 
      addReply(parentComment, content, user, postAuthorId,mediaFile),
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