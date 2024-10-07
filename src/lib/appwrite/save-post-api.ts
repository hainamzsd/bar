import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from './config';
import { ISavedPost, ISavedPostFromAPI } from '@/types';

export async function savePost(userId: string, postId: string): Promise<ISavedPost> {
  try {
    const existingSaves = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.savedPostCollectionId as string,
      [
        Query.equal('user', userId),
        Query.equal('post', postId)
      ]
    );

    if (existingSaves.documents.length > 0) {
      return existingSaves.documents[0] as any;
    }

    const savedPost = await databases.createDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.savedPostCollectionId as string,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    return savedPost as any;
  } catch (error) {
    console.error("Error saving post:", error);
    throw new Error("Failed to save post. Please try again.");
  }
}

export async function unsavePost(userId: string, postId: string): Promise<void> {
  try {
    const savedPosts = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.savedPostCollectionId as string,
      [
        Query.equal('user', userId),
        Query.equal('post', postId)
      ]
    );

    if (savedPosts.documents.length === 0) {
      throw new Error("Saved post not found");
    }

    const savedPostId = savedPosts.documents[0].$id;

    await databases.deleteDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.savedPostCollectionId as string,
      savedPostId
    );
  } catch (error) {
    console.error("Error unsaving post:", error);
    throw new Error("Failed to unsave post. Please try again.");
  }
}

export async function hasUserSavedPost(userId: string, postId: string): Promise<boolean> {
  try {
    const savedPosts = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.savedPostCollectionId as string,
      [
        Query.equal('user', userId),
        Query.equal('post', postId)
      ]
    );

    return savedPosts.documents.length > 0;
  } catch (error) {
    console.error("Error checking if user saved post:", error);
    throw new Error("Failed to check saved status. Please try again.");
  }
}

export async function getUserSavedPosts(userId: string): Promise<ISavedPostFromAPI[]> {
  try {
    const savedPosts = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.savedPostCollectionId as string,
      [Query.equal('user', userId)]
    );

    return savedPosts.documents as any[];
  } catch (error) {
    console.error("Error getting user's saved posts:", error);
    throw new Error("Failed to fetch saved posts. Please try again.");
  }
}