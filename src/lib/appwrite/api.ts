import { INewUser } from "@/types";
import {ID, OAuthProvider, Query} from 'appwrite'
import { account, appwriteConfig, avatars, databases } from "./config";
import { headers } from "next/headers";

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
            imageUrl: avatarUrl,
        })
        return newUser;
    }catch(error){
        console.log(error)
        console.log("WAHHTH")
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    username: string;
    imageUrl: URL;
}){
    try{
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId as any, 
            appwriteConfig.userCollectionId as any,
            ID.unique(), 
            user
        );
        return newUser
    }catch(error){
        console.log(error)
    }

}

export async function signInAccount(user: {
    email:string;
    password:string
}){
    try{
        const session = await account.createEmailPasswordSession(user.email,user.password);
        return session;
    }catch(error){
        console.log(error)
    }
}
export async function signInFacebook() {
    const origin = headers().get("origin");
    try {
        // Create OAuth session
        const session = await account.createOAuth2Session(
            OAuthProvider.Facebook, // provider
            `${origin}/home`,
		`${origin}/`,
        );

        // Get current user account
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error("Failed to retrieve current account");

        // Check if the user exists in the database
        const existingUser = await databases.listDocuments(
            appwriteConfig.databaseId as any,
            appwriteConfig.userCollectionId as any,
            [Query.equal('accountId', currentAccount.$id)]
        );
        if (existingUser.total === 0) {
            const avatarUrl = avatars.getInitials(currentAccount.name || currentAccount.email);
            const newUser = await saveUserToDB({
                accountId: currentAccount.$id,
                email: currentAccount.email,
                username: currentAccount.name || currentAccount.email.split('@')[0],
                imageUrl: avatarUrl,
            });
        }
        return session;
    } catch (error) {
        console.log("Error during Facebook sign-in:", error);
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