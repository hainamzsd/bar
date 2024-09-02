import {Client, Account, Databases, Storage, Avatars, ID} from 'appwrite';

export const appwriteConfig = {
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    url: process.env.NEXT_PUBLIC_APPWRITE_URL,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
    storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE,
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_ID,
    postCollectionId: process.env.NEXT_PUBLIC_APPWRITE_POSTS_ID,
    saveCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SAVEPOSTS_ID
}

export const client = new Client();
if (!appwriteConfig.projectId) {
  throw new Error('NEXT_APPWRITE_PROJECT_ID is not defined');
}

if (!appwriteConfig.url) {
  throw new Error('NEXT_APPWRITE_URL is not defined');
}
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

