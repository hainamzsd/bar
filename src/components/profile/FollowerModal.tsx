"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Users } from 'lucide-react'
import { useFollowUser, useUnfollowUser, useIsFollowing, useGetFollowers } from '@/lib/react-query/followerQueriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import Link from 'next/link'

interface FollowersModalProps {
  showFollowersModal: boolean
  setShowFollowersModal: (open: boolean) => void
  followerCount: number
  userId: string
}

export default function FollowersModal({ showFollowersModal, setShowFollowersModal, followerCount, userId }: FollowersModalProps) {
  const { user: currentUser } = useUserContext()
  const { data: followers, isLoading } = useGetFollowers(userId)
  const { mutate: followUser, isPending: isFollowLoading } = useFollowUser()
  const { mutate: unfollowUser, isPending: isUnfollowLoading } = useUnfollowUser()

  const handleFollowToggle = (followerId: string, isCurrentlyFollowing: boolean) => {
    if (isCurrentlyFollowing) {
      unfollowUser({ followedId: followerId, followerId: currentUser.accountId })
    } else {
      followUser({ followedId: followerId, followerId: currentUser.accountId })
    }
  }

  return (
    <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          {followerCount} Người theo dõi
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-md max-w-80 rounded-md">
        <DialogHeader>
          <DialogTitle>Người đang theo dõi</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : followers?.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg font-medium">Chưa có ai theo dõi người dùng này.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {followers?.map((follower: any) => (
              <FollowerItem
                key={follower.$id}
                follower={follower}
                currentUserId={currentUser.accountId}
                profileUserId={userId}
                onFollowToggle={handleFollowToggle}
                isFollowLoading={isFollowLoading}
                isUnfollowLoading={isUnfollowLoading}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface FollowerItemProps {
  follower: any
  currentUserId: string
  profileUserId: string
  onFollowToggle: (followerId: string, isCurrentlyFollowing: boolean) => void
  isFollowLoading: boolean
  isUnfollowLoading: boolean
}

function FollowerItem({ follower, currentUserId, profileUserId, onFollowToggle, isFollowLoading, isUnfollowLoading }: FollowerItemProps) {
  const { data: isFollowing } = useIsFollowing(currentUserId, follower.$id)

  const showFollowButton = currentUserId !== follower.$id && follower.$id !== profileUserId

  return (
    <Link href={`/dashboard/profile/${follower.$id}`}>
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={follower.imageUrl} alt={follower.username} />
          <AvatarFallback>{follower.username ? follower.username[0].toUpperCase() : '?'}</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="font-semibold">{follower.username}</p>
        </div>
      </div>
      {/* {showFollowButton && (
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => onFollowToggle(follower.$id, isFollowing ?? false)}
          disabled={isFollowLoading || isUnfollowLoading}
        >
          {isFollowLoading || isUnfollowLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isFollowing ? (
            'Bỏ theo dõi'
          ) : (
            'Theo dõi'
          )}
        </Button>
      )} */}
    </div></Link>
  )
}