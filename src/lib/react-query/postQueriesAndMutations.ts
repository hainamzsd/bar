import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IPost } from '@/types';
import { 
  createPost, 
  updatePost, 
  deletePost, 
  getPostById, 
  getAllPosts, 
  uploadMedia 
} from '../appwrite/post-api';

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

// Hook to upload media
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: (file: File) => uploadMedia(file)
  });
};
