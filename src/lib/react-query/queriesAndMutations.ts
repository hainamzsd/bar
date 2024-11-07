import { 
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { createUserAccount, getMentions, getMiniProfile, getUserByAccountId, getUserById, searchUserByUsername, signInAccount, signInFacebook, signOutAccount, updateUser } from '../appwrite/api'
import { INewUser, IUser } from '@/types'
import { MentionFromAPI } from '@/types/mention'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {email:string;
            password:string}) => signInAccount(user)
    })
}

export const useMentionSuggestions = (mentionQuery: string, showSuggestions: boolean) => {
  return useInfiniteQuery({
    queryKey: ['mentionSuggestions', mentionQuery],
    queryFn: ({ pageParam = 0 }) =>
      searchUserByUsername(mentionQuery).then(res => ({
        users: res.documents,
        nextCursor: pageParam + 5,
      })),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: showSuggestions && mentionQuery.length > 0,
    staleTime: 60000, // Cache results for 1 minute
    refetchOnWindowFocus: false,
  });
};
export const useSearchUserByUsername = (username: string) => {
    return useQuery({
      queryKey: ['searchUser', username],
      queryFn: () => searchUserByUsername(username),
      enabled: !!username,  // Only run if a username is provided
    });
  };

  export const useGetUserByAccountId = (accountId:string) => {
    return useQuery({
        queryKey: ['userByAccountId', accountId],
        queryFn: () => getUserByAccountId(accountId),
        enabled: !!accountId,  // Only run the query if an accountId is provided
        staleTime: 300000, // Cache results for 5 minutes
        refetchOnWindowFocus: false,
    });
};

export const useGetMentions = (userId: string) => {
  return useQuery<MentionFromAPI[], Error>({
      queryKey: ['mentionedUser', userId],
      queryFn: () => getMentions(userId),
      enabled: !!userId,  // Only run the query if a userId is provided
      staleTime: 300000, // Cache results for 5 minutes
      refetchOnWindowFocus: false,
  });
};

// export function useGetMiniProfile(userId: string) {
//   return useQuery<IUser, Error>(
//     ['miniProfile', userId],
//     {
//       queryFn: () => getMiniProfile(userId),
//       enabled: !!userId,
//     }
//   );
// }


export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useSignInFacebook = () => {
    return useMutation({
        mutationFn: signInFacebook,
    });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId)
  });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<IUser> }) => 
      updateUser(userId, userData),
    onSuccess: (updatedUser) => {
      // Ensure updatedUser has the expected structure
      if (updatedUser && updatedUser.$id) {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ['userByAccountId', updatedUser.$id] });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }
    },
  });
};


