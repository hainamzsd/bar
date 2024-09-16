import { INewUser, IUser } from "@/types";
import {ID, Models, OAuthProvider, Query} from 'appwrite'
import { account, appwriteConfig, avatars, databases } from "./config";

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