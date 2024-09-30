import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from './config';
import { ILike } from '@/types';

// Function to like a post
export async function likePost(userId: string, postId: string): Promise<ILike> {
    try {
      // Check if the user has already liked the post
      const existingLikes = await databases.listDocuments(
        appwriteConfig.databaseId as string,
        appwriteConfig.likeCollectionId as string,
        [
          Query.equal('user', userId),
          Query.equal('post', postId)
        ]
      );
  
      if (existingLikes.documents.length > 0) {
        // User has already liked the post
        return existingLikes.documents[0] as any;
      }
  
      // If no existing like, create a new one
      const like = await databases.createDocument(
        appwriteConfig.databaseId as string,
        appwriteConfig.likeCollectionId as string,
        ID.unique(),
        {
          user: userId,
          post: postId,
        }
      );
  
      return like as any;
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  }

export async function unlikePost(userId: string, postId: string): Promise<void> {
    try {
      // First, find the like document
      const likes = await databases.listDocuments(
        appwriteConfig.databaseId as string,
        appwriteConfig.likeCollectionId as string,
        [
          Query.equal('user', userId),
          Query.equal('post', postId)
        ]
      );
  
      // Check if a like exists
      if (likes.documents.length === 0) {
        console.log("Like not found");
        return;
      }
  
      // Get the ID of the first (and should be only) like document
      const likeId = likes.documents[0].$id;
  
      // Delete the like document
      await databases.deleteDocument(
        appwriteConfig.databaseId as string,
        appwriteConfig.likeCollectionId as string,
        likeId
      );
  
      console.log("Post unliked successfully");
    } catch (error) {
      console.error("Error unliking post:", error);
      throw error;
    }
  }

// Function to check if a user has liked a post
export async function hasUserLikedPost(userId: string, postId: string): Promise<boolean> {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.likeCollectionId as string,
      [
        Query.equal('user', userId),
        Query.equal('post', postId)
      ]
    );

    return likes.documents.length > 0;
  } catch (error) {
    console.error("Error checking if user liked post:", error);
    throw error;
  }
}

// Function to get the number of likes for a post
export async function getPostLikesCount(postId: string): Promise<number> {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.likeCollectionId as string,
      [Query.equal('post', postId)]
    );

    return likes.total;
  } catch (error) {
    console.error("Error getting post likes count:", error);
    throw error;
  }
}