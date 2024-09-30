import React from "react";
import { LucideIcon } from "lucide-react"
export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}


export type INavLink = {
    route: string;
    label: string;
    icon: LucideIcon;
  };

  export type IAchievement = {
    achievementId: string;  // Unique ID for the achievement
    title: string;          // Title of the achievement
    description: string;    // Description of the achievement
    iconUrl: string;        // URL to the achievement's icon
  };
  export type IComment = {
    content: string;          // Content of the post
    mediaUrl?: string;        // URL for media (optional if not every post has media)
    mentions?: string[];       // Array of user IDs who are mentioned in the post
    post?: string;
    creator: string;
    parentId?: string;
    level: number;
    imageId?:string;
  };

  export type ICTFQuestion = {
    questionId: string;               // Unique ID for the question
    questionText: string;      // The question text
    difficulty: 'easy' | 'medium' | 'hard';  // Difficulty level as an enum
    hint?: string[];            // Array of hints for the question
    requiredPosts: number;     // Number of posts required to unlock this question
  };
  
  export type IFollowing = {
    followingUserId: string;  
    followedUserId: string;   
  };

  export type INotification = {
    notifyId: string;                 // Unique ID for the notification
    relatedId: string;          // ID related to the notification (e.g., post, comment, etc.)
    content: string;            // Notification content
    // userId: string;             // ID of the user who is notified (relationship with user)
    isRead: boolean;            // Whether the notification has been read
    type: 'like' | 'comment' | 'follow' | 'share' | 'save'; // Type of notification (enum)
  };

  export type IPost = {
    creator: string;          // ID of the post creator (relationship with creator)
    caption: string;            // Caption of the post
    tags?: string[];             // Array of tags associated with the post
    imageUrl?: string;          // URL of the post image (optional if no image)
    imageId?: string;           // Image ID for referencing (optional)
    // saveId: string;             // ID related to saved post (relationship with save)
    content?: string;            // Content of the post
    mentions?: string[];         // Array of mentioned user IDs
  };

  export type ISavedPost = {
    user: IUser;             // ID of the user who saved the post (relationship with user)
    post: IPost;             // ID of the saved post (relationship with post)
  };

  export type IShare = {
    user: IUser;             // ID of the user who saved the post (relationship with user)
    post: IPost;         // ID of the shared post (relationship with posts)
  };

  export type ILike = {
    user: IUser;             // ID of the user who saved the post (relationship with user)
    post: IPost;         // ID of the shared post (relationship with posts)
  };

  export type IUser = {
    accountId: string;
    username: string;
    email: string;
    bio?: string;
    imageUrl: string;
    backgroundUrl?: string | undefined;
    dob?: string | undefined;
    gender?: boolean | undefined;
    facebook?: string | undefined;
    twitter?: string | undefined;
    joinDate: string | undefined
    role: 'customer' | 'staff';
    isActive: boolean;
    ctfStatus?: 'not_started' | 'in_progress' | 'completed';
    achievements?: IAchievement[];
    cTFQuestions?: ICTFQuestion[];
    follower?: IFollowing[];
  };

  export type INewUser = {
    email: string;
    username: string;
    password: string;
  };