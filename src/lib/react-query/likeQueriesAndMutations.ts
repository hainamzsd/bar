import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ILike, IPost } from '@/types';
import { 
  likePost,
  unlikePost,
  hasUserLikedPost,
  getPostLikesCount
} from '../appwrite/like-api';
export const useLikePost = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ userId, postId }: { userId: string, postId: string }) => likePost(userId, postId),
      onMutate: async ({ userId, postId }) => {
        await queryClient.cancelQueries({ queryKey: ['postLikes', postId] });
        await queryClient.cancelQueries({ queryKey: ['userLikedPost', userId, postId] });
  
        const previousLikes = queryClient.getQueryData(['postLikes', postId]);
        const previousLiked = queryClient.getQueryData(['userLikedPost', userId, postId]);
  
        queryClient.setQueryData(['postLikes', postId], (old: number | undefined) => (old || 0) + 1);
        queryClient.setQueryData(['userLikedPost', userId, postId], true);
  
        return { previousLikes, previousLiked };
      },
      onError: (err, { userId, postId }, context) => {
        queryClient.setQueryData(['postLikes', postId], context?.previousLikes);
        queryClient.setQueryData(['userLikedPost', userId, postId], context?.previousLiked);
      },
      onSettled: (_, __, { userId, postId }) => {
        queryClient.invalidateQueries({ queryKey: ['postLikes', postId] });
        queryClient.invalidateQueries({ queryKey: ['userLikedPost', userId, postId] });
      },
    });
  };
  
  export const useUnlikePost = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({userId, postId}: { userId: string, postId: string }) => unlikePost(userId, postId),
      onMutate: async ({ userId, postId }) => {
        await queryClient.cancelQueries({ queryKey: ['postLikes', postId] });
        await queryClient.cancelQueries({ queryKey: ['userLikedPost', userId, postId] });
  
        const previousLikes = queryClient.getQueryData(['postLikes', postId]);
        const previousLiked = queryClient.getQueryData(['userLikedPost', userId, postId]);
  
        queryClient.setQueryData(['postLikes', postId], (old: number | undefined) => Math.max((old || 0) - 1, 0));
        queryClient.setQueryData(['userLikedPost', userId, postId], false);
  
        return { previousLikes, previousLiked };
      },
      onError: (err, { userId, postId }, context) => {
        queryClient.setQueryData(['postLikes', postId], context?.previousLikes);
        queryClient.setQueryData(['userLikedPost', userId, postId], context?.previousLiked);
      },
      onSettled: (_, __, { userId, postId }) => {
        queryClient.invalidateQueries({ queryKey: ['postLikes', postId] });
        queryClient.invalidateQueries({ queryKey: ['userLikedPost', userId, postId] });
      },
    });
  };
// Hook to check if a user has liked a post
export const useHasUserLikedPost = (userId: string, postId: string) => {
  return useQuery({
    queryKey: ['userLikedPost', userId, postId],
    queryFn: () => hasUserLikedPost(userId, postId),
    enabled: !!userId && !!postId,
  });
};

// Hook to get the number of likes for a post
export const useGetPostLikesCount = (postId: string) => {
  return useQuery({
    queryKey: ['postLikes', postId],
    queryFn: () => getPostLikesCount(postId),
    enabled: !!postId,
  });
};