// Define the type for the Post object returned by the API
export type PostFromAPI = {
    $collectionId: string;
    $createdAt: string; // ISO string format
    $databaseId: string;
    $id: string; // The unique ID of the document
    $permissions: string[];
    $updatedAt: string; // ISO string format
    caption: string;
    content: string;
    creator: {
      username: string;
      id: string;
      email: string;
      bio: string | null;
      imageUrl: string;
      // Add other fields as needed
    };
    id: string; // Duplicate of $id, if needed
    imageId: string;
    imageUrl: string;
    mentions: string[];
    tags: string[];
  };
  