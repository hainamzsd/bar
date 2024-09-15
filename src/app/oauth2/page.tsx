"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Query } from "appwrite"
import { PuffLoader } from "react-spinners"
import { account, appwriteConfig, avatars, databases } from "@/lib/appwrite/config"
import { saveUserToDB } from "@/lib/appwrite/api"

export default function Loading() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = React.useState(false)

  React.useEffect(() => {
    async function handlePostLogin() {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            const currentAccount = await account.get();
            const session = await account.getSession("current");
            const providerAccessToken = session.providerAccessToken;
            const facebookUserInfo = await fetch(
                `https://graph.facebook.com/me?fields=id,name,picture.width(200).height(200)&access_token=${providerAccessToken}`
            ).then((res) => res.json());
            let avatarUrl = facebookUserInfo.picture?.data?.url || "";
            if (!currentAccount.$id) {
              throw new Error("Account ID is missing or undefined.");
          }
          const existingUser = await databases.listDocuments(
            appwriteConfig.databaseId as string,
            appwriteConfig.userCollectionId as string,
            [Query.equal("email", currentAccount.email)]  // Ensure accountId has a valid value
        );

            if (existingUser.total === 0) {
                if (!avatarUrl) {
                    avatarUrl = avatars.getInitials(currentAccount.name || currentAccount.email);
                }
                await saveUserToDB({
                    accountId: currentAccount.$id,
                    email: currentAccount.email,
                    username: currentAccount.name || currentAccount.email.split("@")[0],
                    imageUrl: avatarUrl,
                    joinDate: currentAccount.$createdAt,
                    isActive: true,
                    role: 'customer'
                });
            }

            router.replace("/dashboard/explore");
        } catch (error) {
            
            router.replace("/");
        }
    }

    handlePostLogin();
}, [router, isProcessing]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
        <PuffLoader color="hsl(var(--primary))" size={60} />
        <h2 className="text-2xl font-semibold text-card-foreground mt-4">Đang xác thực thông tin...</h2>
      </div>
    </div>
  )
}