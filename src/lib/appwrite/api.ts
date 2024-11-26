import { INewUser, IUser } from "@/types";
import {ID, Models, OAuthProvider, Query} from 'appwrite'
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { MentionFromAPI } from "@/types/mention";
export async function createUserAccount(user: INewUser) {
  try {
    // Check if username already exists
    const existingUsername = await searchUserByUsername(user.username);
    if (existingUsername.total > 0) {
      throw new Error("Username already exists");
    }

    // Check if email already exists
    const existingEmail = await searchUserByEmail(user.email);
    if (existingEmail.total > 0) {
      throw new Error("Email already exists");
    }

    // If no existing username or email, create the account
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.username
    );

    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(user.username);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      username: user.username,
      imageUrl: String(avatarUrl),
      joinDate: new Date().toISOString(),
      isActive: true,
      role: 'customer'
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user account:", error);
    throw error;
  }
}



export async function fetchImages({ pageParam = '' }) {
  const response = await fetch(`/api/images?cursor=${pageParam}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
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

      // Ensure gender is correctly converted to boolean or null
      let convertedGender: boolean | null = null;
      if (userData.gender === 'Male' as any) {
          convertedGender = true;
      } else if (userData.gender === 'Female' as any) {
          convertedGender = false;
      }

      // Filter out the accountId field and update gender
      const { accountId, ...filteredUserData } = userData;
      console.log('Filtered user data:', JSON.stringify(filteredUserData, null, 2));
      const updatedUser = await databases.updateDocument(
          appwriteConfig.databaseId as any,
          appwriteConfig.userCollectionId as any,
          userId,
          { ...filteredUserData, gender: convertedGender } // Use the filtered data with updated gender
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
  export async function searchUserByEmail(email: string) {
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId as string,
        appwriteConfig.userCollectionId as string,
        [Query.equal('email', email)]
      );
  
      return users;
    } catch (error) {
      console.error("Error searching for users by email:", error);
      throw error;
    }
  }
  export async function searchUserByUsername(username: string) {
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId as string,
        appwriteConfig.userCollectionId as string,
        [Query.search('username', username)]
      );
  
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



export async function confirmVerification(userId: string, secret: string) {
try {
  const result = await account.updateVerification(userId, secret);
  return result;
} catch (error) {
  console.error("Error confirming verification:", error);
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

  export async function checkUserLoggedIn() {
    try {
      const user = await account.get();
      return !!user;
    } catch (error) {
      console.error("Error checking user login status:", error);
      return false;
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
    await account.deleteSession('current')
    // You might want to clear any local storage or cookies here
    localStorage.removeItem('user') // Assuming you store user info in localStorage
  } catch (error) {
    console.error("Error during logout:", error)
    throw error
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
