"use client"

import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import { useFollowUser, useUnfollowUser, useIsFollowing, useGetFollowers } from '@/lib/react-query/followerQueriesAndMutations';
import { useUserContext } from '@/context/AuthContext';

interface FollowersModalProps {
  showFollowersModal: boolean;
  setShowFollowersModal: (open: boolean) => void;
  followerCount: number;
  userId: string;
}

const FollowersModal: React.FC<FollowersModalProps> = ({ showFollowersModal, setShowFollowersModal, followerCount, userId }) => {
  const { user: currentUser } = useUserContext();
  const { data: followers, isLoading } = useGetFollowers(userId);
  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();

  const handleFollowToggle = (followerId: string) => {
    const { data: isFollowing } = useIsFollowing(userId, followerId);
    if (isFollowing) {
      unfollowUser({ followedId: userId, followerId: followerId });
    } else {
      followUser({ followedId: userId, followerId: followerId });
    }
  };

  return (
    <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          {followerCount} Người theo dõi
        </Button>
      </DialogTrigger>
      <DialogContent className='md:max-w-md max-w-80 rounded-md'>
        <DialogHeader>
          <DialogTitle>Người đang theo dõi</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center">Đang tải...</div>
        ) : followers?.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Chưa có ai theo dõi bạn.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {followers?.map((follower) => (
              <div key={follower.accountId} className="flex items-center justify-between space-x-4">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={follower.imageUrl} />
                    <AvatarFallback>{follower.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="font-semibold">{follower.username}</p>
                  </div>
                </div>
                {currentUser.accountId !== follower.accountId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => handleFollowToggle(follower.accountId)}
                  >
                    {useIsFollowing(userId, follower.accountId).data ? 'Bỏ theo dõi' : 'Theo dõi lại'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowersModal;