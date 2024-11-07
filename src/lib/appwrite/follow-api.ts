import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from "./config";
import { IUser } from "@/types";

// Function to follow a user
export async function followUser(followedId: string, followerId: string): Promise<void> {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.followerCollectionId as string,
      ID.unique(),
      {
        follower_id: followerId,
        followed_id: followedId
      }
    );
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
}

// Function to unfollow a user
export async function unfollowUser(followedId: string, followerId: string): Promise<void> {
  try {
    const existingFollows = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.followerCollectionId as string,
      [
        Query.equal('follower_id', followerId),
        Query.equal('followed_id', followedId)
      ]
    );

    if (existingFollows.documents.length > 0) {
      await databases.deleteDocument(
        appwriteConfig.databaseId as string,
        appwriteConfig.followerCollectionId as string,
        existingFollows.documents[0].$id
      );
    }
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
}

// Function to get follower count
export async function getFollowerCount(userId: string): Promise<number> {
  try {
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.followerCollectionId as string,
      [Query.equal('followed_id', userId)]
    );
    return followers.total;
  } catch (error) {
    console.error("Error getting follower count:", error);
    throw error;
  }
}

// Function to get following count
export async function getFollowingCount(userId: string): Promise<number> {
  try {
    const following = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.followerCollectionId as string,
      [Query.equal('follower_id', userId)]
    );
    return following.total;
  } catch (error) {
    console.error("Error getting following count:", error);
    throw error;
  }
}

// Function to check if a user is following another user
export async function isFollowing(followedId: string, followerId: string): Promise<boolean> {
  try {
    const existingFollow = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.followerCollectionId as string,
      [
        Query.equal('follower_id', followerId),
        Query.equal('followed_id', followedId)
      ]
    );
    return existingFollow.total > 0;
  } catch (error) {
    console.error("Error checking follow status:", error);
    throw error;
  }
}

export async function getFollowers(userId: string): Promise<IUser[]> {
  try {
    const followersData = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.followerCollectionId as string,
      [
        Query.equal('followed_id', userId),
        Query.limit(100) // Adjust this limit as needed
      ]
    );

    const followerIds = followersData.documents.map(doc => doc.follower_id);

    if (followerIds.length === 0) {
      return [];
    }

    const followersInfo = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.userCollectionId as string,
      [
        Query.equal('$id', followerIds)
      ]
    );

    return followersInfo.documents as any[];
  } catch (error) {
    console.error("Error getting followers:", error);
    throw error;
  }
}

// Function to get users that a user is following
export async function getFollowing(userId: string): Promise<IUser[]> {
  try {
    const followingData = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.followerCollectionId as string,
      [
        Query.equal('follower_id', userId),
        Query.limit(100) // Adjust this limit as needed
      ]
    );

    const followingIds = followingData.documents.map(doc => doc.followed_id);

    if (followingIds.length === 0) {
      return [];
    }

    const followingInfo = await databases.listDocuments(
      appwriteConfig.databaseId as string,
            appwriteConfig.userCollectionId as string,
      [
        Query.equal('$id', followingIds)
      ]
    );

    return followingInfo.documents as any[];
  } catch (error) {
    console.error("Error getting following users:", error);
    throw error;
  }
}