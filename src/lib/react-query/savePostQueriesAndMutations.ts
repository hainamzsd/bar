import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ISavedPost, ISavedPostFromAPI } from '@/types';
import { 
  savePost,
  unsavePost,
  hasUserSavedPost,
  getUserSavedPosts
} from '../appwrite/save-post-api';

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string, postId: string }) => savePost(userId, postId),
    onMutate: async ({ userId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ['userSavedPosts', userId] });
      await queryClient.cancelQueries({ queryKey: ['userSavedPost', userId, postId] });

      const previousSavedPosts = queryClient.getQueryData<ISavedPost[]>(['userSavedPosts', userId]);
      const previousSaved = queryClient.getQueryData<boolean>(['userSavedPost', userId, postId]);

      queryClient.setQueryData<ISavedPost[]>(['userSavedPosts', userId], (old = []) => 
        [...old, { user: userId, post: postId }]
      );
      queryClient.setQueryData(['userSavedPost', userId, postId], true);

      return { previousSavedPosts, previousSaved };
    },
    onError: (err, { userId, postId }, context) => {
      queryClient.setQueryData(['userSavedPosts', userId], context?.previousSavedPosts);
      queryClient.setQueryData(['userSavedPost', userId, postId], context?.previousSaved);
    },
    onSettled: (_, __, { userId, postId }) => {
      queryClient.invalidateQueries({ queryKey: ['userSavedPosts', userId] });
      queryClient.invalidateQueries({ queryKey: ['userSavedPost', userId, postId] });
    },
  });
};

export const useUnsavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({userId, postId}: { userId: string, postId: string }) => unsavePost(userId, postId),
    onMutate: async ({ userId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ['userSavedPosts', userId] });
      await queryClient.cancelQueries({ queryKey: ['userSavedPost', userId, postId] });

      const previousSavedPosts = queryClient.getQueryData<ISavedPost[]>(['userSavedPosts', userId]);
      const previousSaved = queryClient.getQueryData<boolean>(['userSavedPost', userId, postId]);

      queryClient.setQueryData<ISavedPost[]>(['userSavedPosts', userId], (old = []) => 
        old.filter(savedPost => savedPost.post !== postId)
      );
      queryClient.setQueryData(['userSavedPost', userId, postId], false);

      return { previousSavedPosts, previousSaved };
    },
    onError: (err, { userId, postId }, context) => {
      queryClient.setQueryData(['userSavedPosts', userId], context?.previousSavedPosts);
      queryClient.setQueryData(['userSavedPost', userId, postId], context?.previousSaved);
    },
    onSettled: (_, __, { userId, postId }) => {
      queryClient.invalidateQueries({ queryKey: ['userSavedPosts', userId] });
      queryClient.invalidateQueries({ queryKey: ['userSavedPost', userId, postId] });
    },
  });
};

export const useHasUserSavedPost = (userId: string, postId: string) => {
  return useQuery<boolean, Error>({
    queryKey: ['userSavedPost', userId, postId],
    queryFn: () => hasUserSavedPost(userId, postId),
    enabled: !!userId && !!postId,
  });
};

export const useGetUserSavedPosts = (userId: string) => {
  return useQuery<ISavedPostFromAPI[], Error>({
    queryKey: ['userSavedPosts', userId],
    queryFn: () => getUserSavedPosts(userId),
    enabled: !!userId,
  });
};