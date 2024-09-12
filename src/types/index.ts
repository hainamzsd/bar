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
  export type NotificationItem = {
    id: string
    avatarUrl: string
    fallback: string
    message: string
    time: string
  }
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    id: string;
    imageUrl: string;
    dob?: string | undefined;
    username: string;
    bio?: string;
    email: string;
    joinDate: string;
    gender?: boolean | undefined;
    followers: string[];  
    following: string[];  
    facebook?: string | undefined;
    twitter?: string | undefined;
  };
  
  export type INewUser = {
    email: string;
    username: string;
    password: string;
  };