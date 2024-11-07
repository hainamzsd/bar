"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Trophy, Edit, Mail, MapPin, Calendar, Github, Linkedin, Twitter, User, Users, Facebook, Lock, Edit3 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import UserInfoCard from '@/components/profile/InfoCard'
import { IUser } from '@/types'
import { useUserContext } from '@/context/AuthContext'
import { genderToString, getRoleTranslation } from '@/lib/utils'
  import { Textarea } from '@/components/ui/textarea'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import FollowersModal from '@/components/profile/FollowerModal'
import FollowingModal from '@/components/profile/FollowingModal'
import ChangePasswordForm from '@/components/profile/ChangePasswordForm'
import AchievementsCard from '@/components/profile/AchievementsCard'
import { PostCard } from '@/components/post-related/post-card'
import { useGetFollowerCount, useGetFollowingCount } from '@/lib/react-query/followerQueriesAndMutations'
import { PuffLoader } from 'react-spinners'
import { updateUserBio } from '@/lib/appwrite/api'
import { useGetPostsByUserId } from '@/lib/react-query/postQueriesAndMutations'
import PostSkeleton from '@/components/skeleton/post-skeleton'
import { useGetUserShares } from '@/lib/react-query/shareQueiresAndMutations'
import ShareCard from '@/components/ShareCard'


export default function ProfileLayout() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const { user, updateUserInfo } = useUserContext();
  const { data: posts, isPending: isPostsPending, isError: isPostsError } = useGetPostsByUserId(user.accountId);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user.bio || '');
  const { data: shares, isPending: isSharesPending, isError: isSharesError } = useGetUserShares(user.accountId);
  const { data: followerCount = 0 } = useGetFollowerCount(user.accountId)
  const { data: followingCount = 0 } = useGetFollowingCount(user.accountId)

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveBio = async () => {
    setIsLoading(true);
    try {
      // Implement saving logic here
      const updatedUser = await updateUserBio(user.accountId, bio);
      updateUserInfo(updatedUser as any);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 ">
      <Card className="w-full max-w-7xl mx-auto overflow-hidden">
        <ProfileHeader user={{
          imageUrl: user.imageUrl,
          username: user.username,
          backgroundUrl: user.backgroundUrl,
          accountId: user.accountId
        }}
        isOwner={true}
        ></ProfileHeader>
        <CardContent className="pt-24">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold break-all">{user.username}</h1>
              <Badge className="mt-2">{getRoleTranslation(user.role)}</Badge>
            </div>
            <div className="mt-2 sm:mt-0 sm:ml-4 w-full sm:w-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Edit className="mr-2 h-4 w-4" /> Sửa thông tin
                  </Button>
                </DialogTrigger>
                <ProfileEditForm user={user} />
              </Dialog>
            </div>
          </div>
          {!user.bio ? (
            <div className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5 text-muted-foreground" />
              <span className="cursor-pointer" onClick={() => setIsEditingBio(true)}>Tiểu sử</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Tiểu sử:</span>
                <p>{user.bio}</p>
                <Edit3 className="h-5 w-5 text-muted-foreground cursor-pointer" onClick={() => setIsEditingBio(true)} />
              </div>
            </div>
          )}
          {isEditingBio && (
            <div className="mt-4">
              <Textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Thêm tiểu sử..."
              />
              {isLoading && (
                <div className="flex justify-center mb-2">
                  <PuffLoader color="hsl(var(--secondary))" size={20} />
                </div>
              )}
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={handleSaveBio}
                  disabled={isLoading}
                >
                  Lưu
                </Button>
                <Button
                  variant="ghost"
                  className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md"
                  onClick={() => setIsEditingBio(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row md:space-x-4 mb-6 mt-2 space-y-4 md:space-y-0">
          <FollowersModal
            showFollowersModal={showFollowersModal}
            setShowFollowersModal={setShowFollowersModal}
            followerCount={followerCount}
            userId={user.accountId}
          />
          <FollowingModal
            showFollowingModal={showFollowingModal}
            setShowFollowingModal={setShowFollowingModal}
            followingCount={followingCount}
            userId={user.accountId}
          />
          </div>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="personal"
                className="flex items-center justify-center space-x-2 md:space-x-0 md:justify-center"
              >
                <div className="hidden md:block">Thông tin cá nhân</div>
                <div className="block md:hidden">
                  <User className="h-5 w-5" />
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex items-center justify-center space-x-2 md:space-x-0 md:justify-center"
              >
                <div className="hidden md:block">Đổi mật khẩu</div>
                <div className="block md:hidden">
                  <Lock className="h-5 w-5" />
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center justify-center space-x-2 md:space-x-0 md:justify-center"
              >
                <div className="hidden md:block">Thành tựu</div>
                <div className="block md:hidden">
                  <Trophy className="h-5 w-5" />
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <UserInfoCard userInfo={user} />
            </TabsContent>
            <TabsContent value="password">
              <ChangePasswordForm></ChangePasswordForm>
            </TabsContent>
            <TabsContent value="achievements">
              <AchievementsCard></AchievementsCard>
            </TabsContent>
          </Tabs>
          <Separator className="my-8" />
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="posts"
                className="flex items-center justify-center space-x-2 md:space-x-0 md:justify-center"
              >
                <div className="hidden md:block">Bài viết</div>
                <div className="block md:hidden">
                  <User className="h-5 w-5" />
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="shares"
                className="flex items-center justify-center space-x-2 md:space-x-0 md:justify-center"
              >
                <div className="hidden md:block">Chia sẻ</div>
                <div className="block md:hidden">
                  <Users className="h-5 w-5" />
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <div className="space-y-4">
                {isPostsPending ? (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <PostSkeleton key={index} />
                    ))}
                  </>
                ) : isPostsError ? (
                  <p className="text-red-500">Lỗi khi tải bài viết. Vui lòng thử lại sau.</p>
                ) : (
                  <>
                    {posts?.map((post) => (
                      <PostCard key={post.$id} post={post as any} />
                    ))}
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent value="shares">
              <div className="space-y-4">
                {isSharesPending ? (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <PostSkeleton key={index} />
                    ))}
                  </>
                ) : isSharesError ? (
                  <p className="text-red-500">Lỗi khi tải chia sẻ. Vui lòng thử lại sau.</p>
                ) : (
                  <>
                    {shares?.map((share) => (
                      <ShareCard key={share.$id} share={share} currentUserId={user.accountId} />
                    ))}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
