import { ID, Query } from 'appwrite';
import { databases, appwriteConfig, storage } from './config';
import { IComment, IUser } from '@/types'; // Use your custom types
import { CommentFromAPI } from '@/types/comment';
import { deleteFile } from './post-api';

export async function addComment(
  comment: IComment, 
  mediaFile?: File // Optional media file
) {
  try {
    let imageUrl;
    let uploadedFile;

    // If mediaFile exists, upload it
    if (mediaFile) {
      uploadedFile = await storage.createFile(
        appwriteConfig.storageId as string,
        ID.unique(),
        mediaFile
      );
      imageUrl = storage.getFilePreview(appwriteConfig.storageId as string, uploadedFile.$id);
    }

    // Create a new comment with or without image
    const newComment = {
      ...comment,
      mediaUrl: imageUrl ? String(imageUrl) : undefined, // Add image URL if available
    };

    // Save the comment in Appwrite
    const savedComment = await databases.createDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      ID.unique(),
      newComment
    );

    // Clean up: If comment fails, delete the uploaded file
    if (!savedComment && uploadedFile) {
      await deleteFile(uploadedFile.$id);
      throw new Error('Error creating comment, image deleted');
    }
    return savedComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error(`Error adding comment: ${error}`);
  }
}

// Create a reply to a comment
export async function addReply(
  parentComment: CommentFromAPI, // Parent comment ID
  content: string, 
  user: IUser,
  mediaFile?: File // Optional media file
) {
  try {
    let imageUrl;
    let uploadedFile;

    // If mediaFile exists, upload it
    if (mediaFile) {
      uploadedFile = await storage.createFile(
        appwriteConfig.storageId as string,
        ID.unique(),
        mediaFile
      );
      imageUrl = storage.getFilePreview(appwriteConfig.storageId as string, uploadedFile.$id);
    }

    // Create a new reply with or without image
    const newReply: IComment = {
      content,
      post: parentComment.post?.$id, // Link to the post
      creator: user.accountId,
      parentId: parentComment.$id, // Link to parent comment
      level: 1, // Replies increase the level
      mediaUrl: imageUrl ? String(imageUrl) : undefined, // Add image URL if available
    };

    // Save the reply in Appwrite
    const savedReply = await databases.createDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      ID.unique(),
      newReply
    );

    // Clean up: If reply fails, delete the uploaded file
    if (!savedReply && uploadedFile) {
      await deleteFile(uploadedFile.$id);
      throw new Error('Error creating reply, image deleted');
    }

    return savedReply;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw new Error(`Error adding reply: ${error}`);
  }
}

const COMMENTS_PER_PAGE = 4;

export async function fetchTopLevelComments(postId: string, page: number = 1) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      [
        Query.equal('post', postId),
        Query.isNull('parentId'),
        Query.orderDesc('$createdAt'),
        Query.limit(COMMENTS_PER_PAGE),
        Query.offset((page - 1) * COMMENTS_PER_PAGE),
      ]
    );

    return {
      comments: response.documents as any,
      total: response.total,
    };
  } catch (error) {
    console.error('Error fetching top-level comments:', error);
    throw error;
  }
}

export async function fetchReplies(parentCommentId: string, postId: string, page: number = 1) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      [
        Query.equal('parentId', parentCommentId),
        // Query.equal('post', postId), // Ensure replies are linked to the correct post
        Query.orderDesc('$createdAt'),
        Query.limit(COMMENTS_PER_PAGE),
        Query.offset((page - 1) * COMMENTS_PER_PAGE),
      ]
    );

    return {
      replies: response.documents as any,
      total: response.total,
    };
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
}
