import { 
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { createUserAccount, searchUserByUsername, signInAccount, signInFacebook, signOutAccount } from '../appwrite/api'
import { INewUser } from '@/types'

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

export const useSearchUserByUsername = (username: string) => {
    return useQuery({
      queryKey: ['searchUser', username],
      queryFn: () => searchUserByUsername(username),
      enabled: !!username,  // Only run if a username is provided
    });
  };

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
