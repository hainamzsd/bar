import { INewUser } from "@/types";
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
    try {
        // Create OAuth session
        const session = await account.createOAuth2Session(
            OAuthProvider.Facebook, // provider
            `http://localhost:3000/oauth2`,
		`http://localhost:3000/`,
        );
        return session;
    } catch (error) {
        console.log("Error during Facebook sign-in:", error);
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
        console.log("Successfully logged out:", session);
        return session;
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;  // Rethrow the error to handle it upstream if needed
    }
}