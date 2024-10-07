import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from './config';
import { IShare } from '@/types';

export async function sharePost(userId: string, postId: string, comment?: string): Promise<IShare> {
  try {
    const share = await databases.createDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.shareCollectionId as string,
      ID.unique(),
      {
        user: userId,
        post: postId,
        comment: comment || '',
      }
    );

    return share as any;
  } catch (error) {
    console.error("Error sharing post:", error);
    throw new Error("Failed to share post. Please try again.");
  }
}

export async function unsharePost(shareId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.shareCollectionId as string,
      shareId
    );
  } catch (error) {
    console.error("Error unsharing post:", error);
    throw new Error("Failed to unshare post. Please try again.");
  }
}

export async function getPostShares(postId: string): Promise<IShare[]> {
  try {
    const shares = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.shareCollectionId as string,
      [Query.equal('post', postId)]
    );

    return shares.documents as any[];
  } catch (error) {
    console.error("Error getting post shares:", error);
    throw new Error("Failed to fetch post shares. Please try again.");
  }
}

export async function getUserShares(userId: string): Promise<IShare[]> {
  try {
    const shares = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.shareCollectionId as string,
      [Query.equal('user', userId)]
    );

    return shares.documents as any[];
  } catch (error) {
    console.error("Error getting user shares:", error);
    throw new Error("Failed to fetch user shares. Please try again.");
  }
}