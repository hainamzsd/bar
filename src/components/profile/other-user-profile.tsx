'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, User, Users } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import UserInfoCard from '@/components/profile/InfoCard';
import { getRoleTranslation } from '@/lib/utils';
import ProfileHeader from '@/components/profile/ProfileHeader';
import FollowersModal from '@/components/profile/FollowerModal';
import FollowingModal from '@/components/profile/FollowingModal';
import AchievementsCard from '@/components/profile/AchievementsCard';
import { PostCard } from '@/components/post-related/post-card';
import { useGetFollowerCount, useGetFollowingCount } from '@/lib/react-query/followerQueriesAndMutations';
import { useGetPostsByUserId } from '@/lib/react-query/postQueriesAndMutations';
import PostSkeleton from '@/components/skeleton/post-skeleton';
import { followUser, unfollowUser, isFollowing } from '@/lib/appwrite/follow-api';
import { useUserContext } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { useGetUserShares } from '@/lib/react-query/shareQueiresAndMutations';
import ShareCard from '../ShareCard';

interface OtherUserProfileProps {
  user: any;
}

export function OtherUserProfileComponent({ user }: OtherUserProfileProps) {
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(false);
  const { user: currentUser } = useUserContext();

  const { data: posts, isPending: isPostsPending, isError: isPostsError } = useGetPostsByUserId(user.$id);
  const { data: shares, isPending: isSharesPending, isError: isSharesError } = useGetUserShares(user.$id);
  const { data: followerCount = 0 } = useGetFollowerCount(user.$id);
  const { data: followingCount = 0 } = useGetFollowingCount(user.$id);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const followingStatus = await isFollowing(user.$id, currentUser.accountId);
        setIsFollowingUser(followingStatus);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };
    checkFollowStatus();
  }, [user, currentUser]);

  const handleFollow = async () => {
    try {
      await followUser(user.$id, currentUser.accountId);
      setIsFollowingUser(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(user.$id, currentUser.accountId);
      setIsFollowingUser(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="py-8">
      <Card className="w-full max-w-7xl mx-auto overflow-hidden">
        <ProfileHeader user={{
          imageUrl: user.imageUrl,
          username: user.username,
          backgroundUrl: user.backgroundUrl,
          accountId: user.accountId,
        }} 
        isOwner={false}
        />
        <CardContent className="pt-24">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold break-all">{user.username}</h1>
              <Badge className="mt-2">{getRoleTranslation(user.role)}</Badge>
            </div>
            <div className="mt-4 sm:mt-0">
              {isFollowingUser ? (
                <Button onClick={handleUnfollow} variant="outline">Bỏ theo dõi</Button>
              ) : (
                <Button onClick={handleFollow} variant="default">Theo dõi</Button>
              )}
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
              userId={user.$id}
            />
            <FollowingModal
              showFollowingModal={showFollowingModal}
              setShowFollowingModal={setShowFollowingModal}
              followingCount={followingCount}
              userId={user.$id}
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
                ) : shares && shares.length > 0 ? (
                  <>
                    {shares.map((share) => (
                      <ShareCard key={share.$id} share={share} currentUserId={currentUser.accountId} />
                    ))}
                  </>
                ) : (
                  <p>Không có chia sẻ nào.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}