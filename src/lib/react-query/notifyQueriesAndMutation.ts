import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  deleteNotification, 
  getNotificationById, 
  getAllNotifications, 
  markNotificationAsRead,
  getUnreadNotificationCount,
  createNotification
} from '../appwrite/notification-api';
import { INotification } from '@/types';

// Hook to create a notification
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notification: INotification) => createNotification(notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
    onError: (error) => {
      console.error("Error creating notification", error);
    },
  });
};

// Hook to delete a notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
    onError: (error) => {
      console.error("Error deleting notification", error);
    },
  });
};

// Hook to mark a notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
    onError: (error) => {
      console.error("Error marking notification as read", error);
    },
  });
};

// Hook to fetch a notification by ID
export const useGetNotificationById = (notificationId: string) => {
  return useQuery({
    queryKey: ['notification', notificationId],
    queryFn: () => getNotificationById(notificationId),
    enabled: !!notificationId,
  });
};

// Hook to fetch all notifications with pagination
export const useGetAllNotifications = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ['notifications', userId],
    queryFn: ({ pageParam = 0 }) => getAllNotifications(userId, pageParam),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
  });
};

// Hook to get unread notification count
export const useGetUnreadNotificationCount = (userId: string) => {
  return useQuery({
    queryKey: ['unreadNotificationCount', userId],
    queryFn: () => getUnreadNotificationCount(userId),
    refetchInterval: 60000, // Refetch every minute
  });
};