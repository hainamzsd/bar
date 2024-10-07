import { IUser } from ".";
import { CommentFromAPI } from "./comment";
import { PostFromAPI } from "./post";

// Define the type for the Post object returned by the API
export type MentionFromAPI = {
    $collectionId: string;
    $createdAt: string; // ISO string format
    $id: string; // The unique ID of the document
    $permissions: string[];
    $updatedAt: string; // ISO string format
    post: PostFromAPI;
    comment: CommentFromAPI;
    mentioningUser: IUser;
    mentionedUser: IUser;
  };
  
  export type IMention = {
    post: string;
    comment?: string;
    mentioningUser: string;
    mentionedUser: any;
  };
  