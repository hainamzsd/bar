"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, User } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import UserInfoCard from '@/components/profile/InfoCard'
import { IUser } from '@/types'
import { getRoleTranslation } from '@/lib/utils'
import ProfileHeader from '@/components/profile/ProfileHeader'
import FollowersModal from '@/components/profile/FollowerModal'
import FollowingModal from '@/components/profile/FollowingModal'
import AchievementsCard from '@/components/profile/AchievementsCard'
import { PostCard } from '@/components/post-related/post-card'
import { useGetFollowerCount, useGetFollowingCount } from '@/lib/react-query/followerQueriesAndMutations'
import { useGetPostsByUserId } from '@/lib/react-query/postQueriesAndMutations'
import PostSkeleton from '@/components/skeleton/post-skeleton'

interface OtherUserProfileProps {
  user: IUser;
}

export default function OtherUserProfile({ user }: OtherUserProfileProps) {
  const [showFollowersModal, setShowFollowersModal] = React.useState(false)
  const [showFollowingModal, setShowFollowingModal] = React.useState(false)

  const { data: posts, isPending: isPostsPending, isError: isPostsError } = useGetPostsByUserId(user.accountId);
  const { data: followerCount = 0 } = useGetFollowerCount(user.accountId)
  const { data: followingCount = 0 } = useGetFollowingCount(user.accountId)

  return (
    <div className="py-8">
      <Card className="w-full max-w-7xl mx-auto overflow-hidden">
        <ProfileHeader user={{
          imageUrl: user.imageUrl,
          username: user.username,
          backgroundUrl: user.backgroundUrl,
          accountId: user.accountId
        }} />
        <CardContent className="pt-24">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold break-all">{user.username}</h1>
              <Badge className="mt-2">{getRoleTranslation(user.role)}</Badge>
            </div>
          </div>
          {user.bio && (
            <div className="mb-4">
              <span className="font-semibold">Tiểu sử:</span>
              <p>{user.bio}</p>
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
            <TabsList className="grid w-full grid-cols-2">
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
            <TabsContent value="achievements">
              <AchievementsCard />
            </TabsContent>
          </Tabs>
          <Separator className="my-8" />
          <div>
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            <div className="space-y-4">
              {isPostsPending ? (
                <>
                  {[...Array(5)].map((_, index) => (
                    <PostSkeleton key={index} />
                  ))}
                </>
              ) : isPostsError ? (
                <p className="text-red-500">Lỗi khi tải bài viết. Vui lòng thử lại sau.</p>
              ) : posts && posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <PostCard key={post.$id} post={post} />
                  ))}
                </>
              ) : (
                <p>Không có bài viết nào.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}