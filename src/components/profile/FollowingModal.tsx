"use client"

import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useUserContext } from '@/context/AuthContext';
import { useGetFollowing, useUnfollowUser } from '@/lib/react-query/followerQueriesAndMutations';

interface FollowingModalProps {
  showFollowingModal: boolean;
  setShowFollowingModal: (open: boolean) => void;
  followingCount: number;
  userId: string;
}

const FollowingModal: React.FC<FollowingModalProps> = ({ showFollowingModal, setShowFollowingModal, followingCount, userId }) => {
  const { user: currentUser } = useUserContext();
  const { data: following, isLoading } = useGetFollowing(userId);
  const { mutate: unfollowUser } = useUnfollowUser();

  const handleUnfollow = (followedUserId: string) => {
    unfollowUser({ followedId: followedUserId, followerId: userId });
  };

  return (
    <Dialog open={showFollowingModal} onOpenChange={setShowFollowingModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="mr-2 h-4 w-4" />
          {followingCount} Đang theo dõi
        </Button>
      </DialogTrigger>
      <DialogContent className='md:max-w-md max-w-80 rounded-md'>
        <DialogHeader>
          <DialogTitle>Đang theo dõi</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center">Đang tải...</div>
        ) : following?.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Chưa theo dõi ai.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {following?.map((user) => (
              <div key={user.accountId} className="flex items-center justify-between space-x-4">
                <Avatar>
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
                {currentUser.accountId !== user.accountId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => handleUnfollow(user.accountId)}
                  >
                    Bỏ theo dõi
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

export default FollowingModal;