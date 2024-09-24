// Define the type for the Post object returned by the API
export type MentionFromAPI = {
    $collectionId: string;
    $createdAt: string; // ISO string format
    $id: string; // The unique ID of the document
    $permissions: string[];
    $updatedAt: string; // ISO string format
    post: any;
    comment: any;
    mentioningUser: any;
    mentionedUser: any;
  };
  
  export type IMention = {
    post: string;
    comment?: string;
    mentioningUser: string;
    mentionedUser: any;
  };
  