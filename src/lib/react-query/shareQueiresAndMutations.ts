import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IShare } from '@/types';
import { 
  sharePost,
  unsharePost,
  getPostShares,
  getUserShares
} from '../appwrite/share-post-api';

export const useSharePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, postId, comment }: { userId: string, postId: string, comment?: string }) => 
      sharePost(userId, postId, comment),
    onSuccess: (newShare: IShare) => {
      queryClient.invalidateQueries({ queryKey: ['postShares', newShare.post] });
      queryClient.invalidateQueries({ queryKey: ['userShares', newShare.user] });
      
      // Update the post shares count
      queryClient.setQueryData(['postSharesCount', newShare.post], (oldCount: number | undefined) => (oldCount || 0) + 1);
    },
    onError: (error) => {
      console.error("Error sharing post:", error);
    },
  });
};

export const useUnsharePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shareId, postId, userId }: { shareId: string, postId: string, userId: string }) => unsharePost(shareId),
    onSuccess: (_, { postId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['postShares', postId] });
      queryClient.invalidateQueries({ queryKey: ['userShares', userId] });
      
      // Update the post shares count
      queryClient.setQueryData(['postSharesCount', postId], (oldCount: number | undefined) => Math.max((oldCount || 0) - 1, 0));
    },
    onError: (error) => {
      console.error("Error unsharing post:", error);
    },
  });
};

export const useGetPostShares = (postId: string) => {
  return useQuery<any[], Error>({
    queryKey: ['postShares', postId],
    queryFn: () => getPostShares(postId),
    enabled: !!postId,
  });
};

export const useGetUserShares = (userId: string) => {
  return useQuery<IShare[], Error>({
    queryKey: ['userShares', userId],
    queryFn: () => getUserShares(userId),
    enabled: !!userId,
  });
};

export const useGetPostSharesCount = (postId: string) => {
  return useQuery<number, Error>({
    queryKey: ['postSharesCount', postId],
    queryFn: async () => {
      const shares = await getPostShares(postId);
      return shares.length;
    },
    enabled: !!postId,
  });
};