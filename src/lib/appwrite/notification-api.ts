import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from './config';
import { INotification, INotificationFromAPI } from '@/types';


export async function createNotification({
  userId,
  type,
  relatedId,
  content,
  isRead = false,
  sender
}: INotification) {
  try {
    const notification = await databases.createDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.notificationCollectionId as string,
      ID.unique(),
      {
        userId,
        type,
        relatedId,
        content,
        isRead,
        sender
      }
    );

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.notificationCollectionId as string,
      notificationId
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const updatedNotification = await databases.updateDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.notificationCollectionId as string,
      notificationId,
      { isRead: true }
    );
    return updatedNotification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

export async function getNotificationById(notificationId: string) {
  try {
    const notification = await databases.getDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.notificationCollectionId as string,
      notificationId
    );
    return notification;
  } catch (error) {
    console.error("Error fetching notification:", error);
    throw error;
  }
}

export async function getAllNotifications(userId: string, page: number, limit: number = 10) {
  try {
    const notifications = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.notificationCollectionId as string,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(page * limit),
      ]
    );
    return notifications.documents as any;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.notificationCollectionId as string,
      [
        Query.equal('userId', userId),
        Query.equal('isRead', false),
      ]
    );
    return response.total;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    throw error;
  }
}