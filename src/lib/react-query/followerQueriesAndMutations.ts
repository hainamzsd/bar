import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  followUser,
  unfollowUser,
  isFollowing,
  getFollowerCount,
  getFollowingCount,
  getFollowers,
  getFollowing
} from '../appwrite/follow-api';
import { IUser } from '@/types';

// Hook to get followers of a user
export const useGetFollowers = (userId: string) => {
  return useQuery<IUser[], Error>({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
};

// Hook to get users that a user is following
export const useGetFollowing = (userId: string) => {
  return useQuery<IUser[], Error>({
    queryKey: ['following', userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  });
};

// Mutation hook for following a user
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followedId, followerId }: { followedId: string, followerId: string }) => 
      followUser(followedId, followerId),
    onMutate: async ({ followedId, followerId }) => {
      await queryClient.cancelQueries({ queryKey: ['followers', followedId] });
      await queryClient.cancelQueries({ queryKey: ['following', followerId] });
      await queryClient.cancelQueries({ queryKey: ['followerCount', followedId] });
      await queryClient.cancelQueries({ queryKey: ['followingCount', followerId] });

      const previousFollowers = queryClient.getQueryData<IUser[]>(['followers', followedId]);
      const previousFollowing = queryClient.getQueryData<IUser[]>(['following', followerId]);
      const previousFollowerCount = queryClient.getQueryData<number>(['followerCount', followedId]);
      const previousFollowingCount = queryClient.getQueryData<number>(['followingCount', followerId]);

      // Optimistically update
      queryClient.setQueryData<IUser[]>(['followers', followedId], old => 
        old ? [...old, { accountId: followerId } as IUser] : [{ accountId: followerId } as IUser]
      );
      queryClient.setQueryData<IUser[]>(['following', followerId], old => 
        old ? [...old, { accountId: followedId } as IUser] : [{ accountId: followedId } as IUser]
      );
      queryClient.setQueryData<number>(['followerCount', followedId], old => (old || 0) + 1);
      queryClient.setQueryData<number>(['followingCount', followerId], old => (old || 0) + 1);

      return { previousFollowers, previousFollowing, previousFollowerCount, previousFollowingCount };
    },
    onError: (err, { followedId, followerId }, context) => {
      queryClient.setQueryData(['followers', followedId], context?.previousFollowers);
      queryClient.setQueryData(['following', followerId], context?.previousFollowing);
      queryClient.setQueryData(['followerCount', followedId], context?.previousFollowerCount);
      queryClient.setQueryData(['followingCount', followerId], context?.previousFollowingCount);
    },
    onSettled: (_, __, { followedId, followerId }) => {
      queryClient.invalidateQueries({ queryKey: ['followers', followedId] });
      queryClient.invalidateQueries({ queryKey: ['following', followerId] });
      queryClient.invalidateQueries({ queryKey: ['followerCount', followedId] });
      queryClient.invalidateQueries({ queryKey: ['followingCount', followerId] });
    },
  });
};

// Mutation hook for unfollowing a user
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followedId, followerId }: { followedId: string, followerId: string }) => 
      unfollowUser(followedId, followerId),
    onMutate: async ({ followedId, followerId }) => {
      await queryClient.cancelQueries({ queryKey: ['followers', followedId] });
      await queryClient.cancelQueries({ queryKey: ['following', followerId] });
      await queryClient.cancelQueries({ queryKey: ['followerCount', followedId] });
      await queryClient.cancelQueries({ queryKey: ['followingCount', followerId] });

      const previousFollowers = queryClient.getQueryData<IUser[]>(['followers', followedId]);
      const previousFollowing = queryClient.getQueryData<IUser[]>(['following', followerId]);
      const previousFollowerCount = queryClient.getQueryData<number>(['followerCount', followedId]);
      const previousFollowingCount = queryClient.getQueryData<number>(['followingCount', followerId]);

      // Optimistically update
      queryClient.setQueryData<IUser[]>(['followers', followedId], old => 
        old ? old.filter(user => user.accountId !== followerId) : []
      );
      queryClient.setQueryData<IUser[]>(['following', followerId], old => 
        old ? old.filter(user => user.accountId !== followedId) : []
      );
      queryClient.setQueryData<number>(['followerCount', followedId], old => Math.max((old || 0) - 1, 0));
      queryClient.setQueryData<number>(['followingCount', followerId], old => Math.max((old || 0) - 1, 0));

      return { previousFollowers, previousFollowing, previousFollowerCount, previousFollowingCount };
    },
    onError: (err, { followedId, followerId }, context) => {
      queryClient.setQueryData(['followers', followedId], context?.previousFollowers);
      queryClient.setQueryData(['following', followerId], context?.previousFollowing);
      queryClient.setQueryData(['followerCount', followedId], context?.previousFollowerCount);
      queryClient.setQueryData(['followingCount', followerId], context?.previousFollowingCount);
    },
    onSettled: (_, __, { followedId, followerId }) => {
      queryClient.invalidateQueries({ queryKey: ['followers', followedId] });
      queryClient.invalidateQueries({ queryKey: ['following', followerId] });
      queryClient.invalidateQueries({ queryKey: ['followerCount', followedId] });
      queryClient.invalidateQueries({ queryKey: ['followingCount', followerId] });
    },
  });
};

// Hook to check if a user is following another user
export const useIsFollowing = (followedId: string, followerId: string) => {
  return useQuery({
    queryKey: ['isFollowing', followedId, followerId],
    queryFn: () => isFollowing(followedId, followerId),
    enabled: !!followedId && !!followerId,
  });
};

// Hook to get the follower count for a user
export const useGetFollowerCount = (userId: string) => {
  return useQuery({
    queryKey: ['followerCount', userId],
    queryFn: () => getFollowerCount(userId),
    enabled: !!userId,
  });
};

// Hook to get the following count for a user
export const useGetFollowingCount = (userId: string) => {
  return useQuery({
    queryKey: ['followingCount', userId],
    queryFn: () => getFollowingCount(userId),
    enabled: !!userId,
  });
};