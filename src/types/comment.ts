import { IComment, IPost } from ".";
import { PostFromAPI } from "./post";

    export type CommentFromAPI = {
        $collectionId: string;
        $createdAt: string; // ISO string format
        $id: string; // The unique ID of the document
        $permissions: string[];
        $updatedAt: string; // ISO string format
        content: string;          // Content of the post
        mediaUrl?: string;        // URL for media (optional if not every post has media)
        mentions?: string[];       // Array of user IDs who are mentioned in the post
        post: PostFromAPI;
        creator: {
            username: string;
            id: string;
            email: string;
            bio: string | null;
            imageUrl: string;
        };
        parentId?: string;
        level: number;
    };
