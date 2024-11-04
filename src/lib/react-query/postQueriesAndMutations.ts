import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IPost } from '@/types';
import { 
  createPost, 
  updatePost, 
  deletePost, 
  getPostById, 
  getAllPosts, 
  uploadMedia, 
  searchPostsByTitle,
  getMentionsByPostId,
  getPostsByUserId
} from '../appwrite/post-api';
import { MentionFromAPI } from '@/types/mention';
import { PostFromAPI } from '@/types/post';

// Hook to create a post
export const useCreatePost = () => {
  return useMutation({
    mutationFn: ({ post, mediaFile }: { post: IPost, mediaFile?: File }) => createPost(post, mediaFile),
    onSuccess: () => {
        // Optionally, invalidate queries or handle success UI
        
      },
      onError: (error) => {
        console.error("Error creating post", error);
      },
  });
};

export const useSearchPostsByTitle = (title: string) => {
  return useQuery({
    queryKey: ['searchPosts', title], // Unique query key based on the search term
    queryFn: () => searchPostsByTitle(title),
    enabled: !!title, // Only run the query if the title is not empty
  });
};

// Hook to update a post
export const useUpdatePost = () => {
  return useMutation({
    mutationFn: ({ postId, updatedData, newMediaFile }: { postId: string, updatedData: Partial<IPost>, newMediaFile?: File }) => updatePost(postId, updatedData, newMediaFile)
  });
};

// Hook to delete a post
export const useDeletePost = () => {
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId)
  });
};
export const useGetMentionsByPostId = (postId: string) => {
  return useQuery<MentionFromAPI[], Error>({
      queryKey: ['mentions', postId],
      queryFn: () => getMentionsByPostId(postId),
      enabled: !!postId, // Only run the query if a postId is provided
      staleTime: 300000, // Cache results for 5 minutes
      refetchOnWindowFocus: false,
  });
};
// Hook to fetch a post by ID
export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId)
  });
};

// Hook to fetch all posts
export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => getAllPosts()
  });
};
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: (file: File) => uploadMedia(file)
  });
};
export const useGetPostsByUserId = (userId: string) => {
  return useQuery<PostFromAPI[], Error>({
    queryKey: ['posts', 'user', userId],
    queryFn: async () => {
      const documents = await getPostsByUserId(userId);
      return documents.map(doc => ({
        $collectionId: doc.$collectionId,
        $createdAt: doc.$createdAt,
        $id: doc.$id,
        $permissions: doc.$permissions,
        $updatedAt: doc.$updatedAt,
        caption: doc.caption,
        content: doc.content,
        creator: {
          accountId: doc.creator.accountId,
          username: doc.creator.username,
          email: doc.creator.email,
          bio: doc.creator.bio,
          imageUrl: doc.creator.imageUrl,
        },
        imageId: doc.imageId,
        imageUrl: doc.imageUrl,
        mentions: doc.mentions,
        tags: doc.tags,
      }));
    },
    enabled: !!userId,
    staleTime: 300000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};