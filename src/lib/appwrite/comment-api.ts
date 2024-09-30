import { ID, Query } from 'appwrite';
import { databases, appwriteConfig, storage } from './config';
import { IComment, IUser } from '@/types';
import { CommentFromAPI } from '@/types/comment';
import { deleteFile } from './post-api';
import { extractMentions } from '../utils';

export async function addComment(
  comment: IComment, 
  mediaFile?: File
) {
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
      imageUrl = storage.getFilePreview(appwriteConfig.storageId as string, uploadedFile.$id);
      imageId = uploadedFile.$id;
    }

    const newComment = {
      ...comment,
      mediaUrl: imageUrl ? String(imageUrl) : undefined,
      imageId,
    };

    const savedComment = await databases.createDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      ID.unique(),
      newComment
    );

    if (!savedComment && uploadedFile) {
      await deleteFile(uploadedFile.$id);
      throw new Error('Error creating comment, image deleted');
    }

    await createMentions(comment.post,savedComment.$id, comment.content ?? '', comment.creator, 'comment');
    return savedComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error(`Error adding comment: ${error}`);
  }
}

export async function addReply(
  parentComment: CommentFromAPI,
  content: string, 
  user: IUser,
  mediaFile?: File
) {
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
      imageUrl = storage.getFilePreview(appwriteConfig.storageId as string, uploadedFile.$id);
      imageId = uploadedFile.$id;
    }

    const newReply: IComment = {
      content,
      post: parentComment.post?.$id,
      creator: user.accountId,
      parentId: parentComment.$id,
      level: 1,
      mediaUrl: imageUrl ? String(imageUrl) : undefined,
    };

    const savedReply = await databases.createDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      ID.unique(),
      newReply
    );

    if (!savedReply && uploadedFile) {
      await deleteFile(uploadedFile.$id);
      throw new Error('Error creating reply, image deleted');
    }

    await createMentions(parentComment.post.$id ,savedReply.$id, content ?? '', user.accountId, 'reply');
    return savedReply;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw new Error(`Error adding reply: ${error}`);
  }
}

async function createMentions(postId: string|undefined,commentId: string, content: string, mentioningUserId: string, type: 'comment' | 'reply') {
  const mentionedUsernames = extractMentions(content);
  for (const username of mentionedUsernames) {
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId as string,
        appwriteConfig.userCollectionId as string,
        [Query.equal('username', username)]
      );
      if (users.documents.length > 0) {
        const mentionedUser = users.documents[0];

        await databases.createDocument(
          appwriteConfig.databaseId as string,
          appwriteConfig.mentionCollectionId as string,
          ID.unique(),
          {
            comment: commentId,
            mentioningUser: mentioningUserId,
            mentionedUser: mentionedUser.$id,
            post: postId,
          }
        );
        console.log(`Mention created for user ${username} in ${type}`);
      } else {
        console.warn(`User ${username} not found in the database`);
      }
    } catch (error) {
      console.error(`Error creating mention for user ${username}:`, error);
    }
  }
}
export async function fetchCommentCount(postId: string): Promise<number> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      [
        Query.equal('post', postId),
      ]
    );

    return response.total; // Total number of comments
  } catch (error) {
    console.error('Error fetching comment count:', error);
    throw error;
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
        Query.equal('post', postId),
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

export async function updateComment(commentId: string, updatedData: Partial<IComment>, newMediaFile?: File) {
  try {
    let updatedImageUrl = updatedData.mediaUrl;
    let updatedImageId = updatedData.imageId;

    if (newMediaFile) {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId as string,
        ID.unique(),
        newMediaFile
      );
      updatedImageUrl = String(storage.getFilePreview(appwriteConfig.storageId as string, uploadedFile.$id));
      updatedImageId = uploadedFile.$id;
    }

    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      commentId,
      {
        ...updatedData,
        mediaUrl: updatedImageUrl,
        imageId: updatedImageId,
      }
    );

    if (updatedData.content) {
      await createMentions(undefined,commentId, updatedData.content, updatedComment.creator, updatedComment.parentId ? 'reply' : 'comment');
    }

    return updatedComment;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      commentId
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

export async function getCommentById(commentId: string) {
  try {
    const comment = await databases.getDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.commentCollectionId as string,
      commentId
    );

    return comment;
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
}