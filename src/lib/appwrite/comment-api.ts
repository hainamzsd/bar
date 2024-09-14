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
  parentComment: CommentFromAPI, 
  content: string, 
  user: IUser
) {
  try {
    const newReply: IComment = {
      content,
      post: parentComment.post, // Ensure it's linked to the same post
      creator: user.accountId,
      parentId: parentComment.$id, // Link to parent comment
      level: parentComment.level + 1, // Replies increase the level

    };

    // Save the reply in Appwrite
    const savedReply = await databases.createDocument(
      appwriteConfig.databaseId as any,
      appwriteConfig.commentCollectionId as any,
      ID.unique(), // Use the unique ID generated for the reply
      newReply
    );

    return savedReply;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
}
export async function fetchTopLevelComments(postId: string){
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId as any,
        appwriteConfig.commentCollectionId as any,
        [
          Query.equal('post', postId), // Filter comments by the post ID
          Query.isNull('parentId'), // Only fetch top-level comments
          Query.orderDesc('$createdAt'), // Order by created date (optional)
        ]
      );
  
      // Filter out comments that have a parentId to ensure they are top-level
      // const comments = response.documents
      //   .filter((doc: any) => !doc.parentId) // Ensure parentId is not set
      //   .map((doc: any) => ({
      //     id: doc.$id,
      //     content: doc.content,
      //     mediaUrl: doc.mediaUrl,
      //     mentions: doc.mentions,
      //     post: doc.post,
      //     creator: doc.creator,
      //     parentId: doc.parentId,
      //     level: doc.level,
      //   }));
  
      return response.documents;
    } catch (error) {
      console.error('Error fetching top-level comments:', error);
      throw error;
    }
  }
  export async function fetchReplies(parentCommentId: string) {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId as any,
        appwriteConfig.commentCollectionId as any,
        [Query.equal('parentId', parentCommentId),
          Query.orderDesc('$createdAt'), // Order by created date (optional)
        ]
      );
  
  
      return response.documents;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  }
