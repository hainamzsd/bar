  import { ID, Query } from 'appwrite';
  import { databases, appwriteConfig, storage } from './config';
  import { IPost } from '@/types';
import { extractMentions, getDynamicUrl } from '../utils';
import { MentionFromAPI } from '@/types/mention';
import { createNotification } from './notification-api';
import { getUserByAccountId } from './api';

  // Function to create a new post
  export async function createPost(post: IPost, mediaFile?: File) {
    try {
      let imageUrl;
      let imageId = '';
      let uploadedFile;
      if (mediaFile) {
        uploadedFile = await storage.createFile(
          appwriteConfig.storageId as string, 
          ID.unique(), 
          mediaFile
        );
        imageUrl = uploadedFile.$id ? storage.getFilePreview(appwriteConfig.storageId as string, uploadedFile.$id) : '';
        imageId = uploadedFile.$id;
      }

      // Create the post document in the database
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId as string,
        appwriteConfig.postCollectionId as string,
        ID.unique(),
        {
          ...post,
          imageUrl,
          imageId,
        }
      );
      if (!newPost && uploadedFile) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      await createMentions(newPost.$id, post.content ?? '', post.creator, post.creator);
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  async function createMentions(postId: string, content: string, mentioningUserId: string, creatorId: string) {
    const mentionedUsernames = extractMentions(content);
    for (const username of mentionedUsernames) {
      try {
        // Find the mentioned user
        const users = await databases.listDocuments(
          appwriteConfig.databaseId as string,
          appwriteConfig.userCollectionId as string,
          [Query.equal('username', username)]
        );
        if (users.documents.length > 0) {
          const mentionedUser = users.documents[0];

          // Create a mention document
          await databases.createDocument(
            appwriteConfig.databaseId as string,
            appwriteConfig.mentionCollectionId as string,
            ID.unique(),
            {
              post: postId,
              mentioningUser: mentioningUserId,
              mentionedUser: mentionedUser.$id,
              comment: content
            }
          );
          console.log(mentionedUser.$id)
          console.log(mentioningUserId)
          console.log('hello')
          // const mentioningUser = await getUserByAccountId(creatorId);
         
          await createNotification({
            userId: mentionedUser.$id,
            type: 'mention',
            relatedId: getDynamicUrl(`/dashboard/post/${postId}`),
            content: `Bạn đã được nhắc đến trong 1 bài viết.`,
            isRead: false,
            sender: mentioningUserId
          });
  
        } else {
          console.warn(`User ${username} not found in the database`);
        }
      } catch (error) {
        console.error(`Error creating mention for user ${username}:`, error);
      }
    }
  }
  // Function to update an existing post
  export async function updatePost(postId: string, updatedData: Partial<IPost>, newMediaFile?: File){
    try {
      let updatedImageUrl:string | URL | undefined = updatedData.imageUrl;
      let updatedImageId = updatedData.imageId;

      // If a new media file is provided, upload it and replace the old one
      if (newMediaFile) {
        const uploadedFile = await storage.createFile(
          appwriteConfig.storageId as string, 
          ID.unique(), 
          newMediaFile
        );
        updatedImageUrl = uploadedFile.$id ? storage.getFilePreview(appwriteConfig.storageId as any, uploadedFile.$id) : '';
        updatedImageId = uploadedFile.$id;
      }

      // Update the post in the database
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId as string,
        appwriteConfig.postCollectionId as string,
        postId,
        {
          ...updatedData,
          imageUrl: updatedImageUrl,
          imageId: updatedImageId,
        }
      );

      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  // Function to delete a post by ID
  export async function deletePost(postId: string): Promise<void> {
    try {
      // Delete the post document from the database
      await databases.deleteDocument(
        appwriteConfig.databaseId as string,
        appwriteConfig.postCollectionId as string,
        postId
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }

  // Function to fetch a post by ID
  export async function getPostById(postId: string){
    try {
      const post = await databases.getDocument(
        appwriteConfig.databaseId as string,
        appwriteConfig.postCollectionId as string,
        postId
      );

      return post;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  }

  // Function to fetch all posts (with optional query parameters)
  export async function getAllPosts(page: number, limit: number = 10) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId as string,
        appwriteConfig.postCollectionId as string,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(page * limit),
        ]
      );
  
      return posts.documents;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId as string, fileId);

      return { status: "ok" };
    } catch (error) {
      
      throw error;
    }
  }

  // Function to upload media to Appwrite Storage
  export async function uploadMedia(file: File): Promise<{ imageUrl: URL; imageId: string } | null> {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId as string, 
        ID.unique(), 
        file
      );

      const imageUrl = storage.getFilePreview(appwriteConfig.storageId as string, uploadedFile.$id);
      return { imageUrl , imageId: uploadedFile.$id };
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  }

  export async function searchPostsByTitle(title: string) {
    try {
      // Search for posts where the 'title' field matches or contains the search term
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId as string,
        appwriteConfig.postCollectionId as string,
        [
          Query.search('caption', title) // Search query for the title field
        ]
      );
  
      // Optionally, you can sort the results by creation date
      const sortedPosts = posts.documents.sort(
        (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
  
      return sortedPosts;
    } catch (error) {
      console.error('Error searching posts by title:', error);
      throw error;
    }
  }
  export async function getPostsByUserId(userId: string) {
    try {
      // Query the database for posts with the specified userId
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId as string,
        appwriteConfig.postCollectionId as string,
        [
          Query.equal('creator', userId) // Assuming 'userId' is the field name in your post documents
        ]
      );
  
      // Optionally, sort the posts by creation date
      const sortedPosts = posts.documents.sort(
        (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
  
      return sortedPosts;
    } catch (error) {
      console.error('Error fetching posts by userId:', error);
      throw error;
    }
  }

  export async function getMentionsByPostId(postId: string): Promise<MentionFromAPI[]> {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId as string,
            appwriteConfig.mentionCollectionId as string,
            [
                Query.equal('post', postId),
                Query.orderDesc('$createdAt'),
                Query.limit(100) // Limit the number of results as needed
            ]
        );

        return response.documents as any;
    } catch (error) {
        console.error("Error fetching mentions by postId:", error);
        throw error;
    }
}