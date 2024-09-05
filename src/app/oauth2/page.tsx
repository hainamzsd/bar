"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { Query } from "appwrite";
import { Progress } from "@/components/ui/progress";
import { account, appwriteConfig, avatars, databases } from "@/lib/appwrite/config";
import { saveUserToDB } from "@/lib/appwrite/api";

export default function Loading() {
  const router = useRouter();
  const [progress, setProgress] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    async function handlePostLogin() {
      if (isProcessing) return; // Prevent multiple executions
      setIsProcessing(true); // Mark processing as started

      try {
        // Simulate initial progress
        setProgress(30);

        // Get current user account
        const currentAccount = await account.get();
        const session = await account.getSession("current");
        const providerAccessToken = session.providerAccessToken;
        const facebookUserInfo = await fetch(
            `https://graph.facebook.com/me?fields=id,name,picture.width(200).height(200)&access_token=${providerAccessToken}`
          ).then((res) => res.json());
          let avatarUrl = facebookUserInfo.picture?.data?.url || "";
        // Simulate progress
        setProgress(50);

        // Check if the user exists in the database
        const existingUser = await databases.listDocuments(
          appwriteConfig.databaseId as any,
          appwriteConfig.userCollectionId as any,
          [Query.equal("accountId", currentAccount.$id)]
        );
        
        // Simulate progress
        setProgress(70);

        // If the user does not exist, create a new user in the database
        if (existingUser.total === 0) {
            if(!avatarUrl){
                avatarUrl = avatars.getInitials(currentAccount.name || currentAccount.email);
            }
          await saveUserToDB({
            accountId: currentAccount.$id,
            email: currentAccount.email,
            username: currentAccount.name || currentAccount.email.split("@")[0],
            imageUrl: avatarUrl,
          });
        }

        // Simulate progress completion
        setProgress(100);

        // Redirect to the home page after processing
        setTimeout(() => {
          router.replace("/home");
        }, 500); // Allow some time for the progress to complete visually
      } catch (error) {
        console.log("Error during post-login handling:", error);
        router.replace("/"); // Redirect to a fallback page if something goes wrong
      }
    }

    handlePostLogin();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2>Loading...</h2>
      <Progress value={progress} />
    </div>
  );
}
