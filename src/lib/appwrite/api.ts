import { INewUser, IUser } from "@/types";
import {ID, Models, OAuthProvider, Query} from 'appwrite'
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { MentionFromAPI } from "@/types/mention";

export async function createUserAccount(user: INewUser){
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
        )

        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(user.username);
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            username: user.username,
            imageUrl: String(avatarUrl),
            joinDate:new Date().toISOString(),
            isActive: true,
            role: 'customer'
        })
        return newUser;
    }catch(error){
        console.log(error)
        console.log("WAHHTH")
        return error;
    }
}
export async function uploadMedia(file: File): Promise<{ imageUrl: URL; imageId: string } | null> {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId as string, 
        ID.unique(), 
        file
      );

      const imageUrl = storage.getFilePreview(appwriteConfig.storageId as string, uploadedFile.$id);
      return { imageUrl , imageId: uploadedFile.$id };
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  }

export async function saveUserToDB(user: IUser) {
    try {
        // Check if the user already exists
        const existingUser = await databases.listDocuments(
            appwriteConfig.databaseId as any,
            appwriteConfig.userCollectionId as any,
            [Query.equal("accountId", user.accountId)]
        );

        if (existingUser.total > 0) {
            // If the user already exists, do not create a new one
            
            return existingUser.documents[0];
        }

        // If the user does not exist, create a new document
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId as any,
            appwriteConfig.userCollectionId as any,
            ID.unique(),  // Use a unique ID for the new document
            user
        );

        return newUser;
    } catch (error) {
        console.error("Error saving user to database:", error);
        throw error;  // Re-throw the error to be handled by the caller
    }
}
export async function updateUser(userId: string, userData: Partial<IUser>) {
    try {
        console.log('Updating user with ID:', userId);

        // Filter out the accountId field from userData
        const { accountId, ...filteredUserData } = userData;

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId as any,
            appwriteConfig.userCollectionId as any,
            userId,
            filteredUserData // Use the filtered data
        );

        if (!updatedUser) throw new Error('Failed to update user');

        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId as string, fileId);

      return { status: "ok" };
    } catch (error) {
      
      throw error;
    }
  }

export async function searchUserByUsername(username: string) {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId as any,
            appwriteConfig.userCollectionId as any,
            [Query.search('username', username)]
        );

        if (users.total === 0) {
            throw new Error(`No users found with the username: ${username}`);
        }

        return users;
    } catch (error) {
        console.error("Error searching for users:", error);
        throw error;
    }
}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch (error: any) {
        
        // Re-throw the error to pass it up to the caller
        throw error; 
    }
}
export async function signInFacebook() {
    try {
        // Create OAuth session
        const session = await account.createOAuth2Session(
            OAuthProvider.Facebook, // provider
            `http://localhost:3000/oauth2`, // Update this to the correct URL
  `http://localhost:3000/`
        );
        return session;
    } catch (error) {
        
    }
}
export async function getUserById(userId: string){
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.userCollectionId as string,
      userId
    );

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function getUserByAccountId(accountId:string) {
    try {
        const userDocument = await databases.listDocuments(
            appwriteConfig.databaseId as any,
            appwriteConfig.userCollectionId as any,
            [Query.equal('accountId', accountId)]
        );

        if (!userDocument || userDocument.documents.length === 0) {
            throw new Error('User not found');
        }

        return userDocument.documents[0] as any
    } catch (error) {
        console.error("Error fetching user by accountId:", error);
        throw error;  // Rethrow the error for upstream handling
    }
}

export async function getMentions(userId: string): Promise<MentionFromAPI[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId as any,
        appwriteConfig.mentionCollectionId as any,
        [
          Query.equal('mentionedUser', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      return response.documents as any[];
    } catch (error) {
      console.error("Error fetching mentions:", error);
      throw error;
    }
  }
  
  export async function getMiniProfile(userId: string): Promise<IUser> {
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId as any,
        appwriteConfig.userCollectionId as any,
        userId
      );
      return response as any;
    } catch (error) {
      console.error("Error fetching mini profile:", error);
      throw error;
    }
  }
export async function getCurrentUser(){
    try{
        const currentAccount = await account.get();
        
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId as any,
            appwriteConfig.userCollectionId as any,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    }catch(error){
        console.log(error)
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        
        return session;
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;  // Rethrow the error to handle it upstream if needed
    }
}

export async function updateUserBio(accountId: string, bio: string) {
  try {
    const updatedUser = await updateUser(accountId, { bio });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user bio:", error);
    throw error;
  }
}
