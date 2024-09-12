import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

interface FollowersModalProps {
  showFollowersModal: boolean;
  setShowFollowersModal: (open: boolean) => void;
  followers: string[];
}

const FollowersModal: React.FC<FollowersModalProps> = ({ showFollowersModal, setShowFollowersModal, followers }) => {
  return (
    <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          {followers.length} Người theo dõi
        </Button>
      </DialogTrigger>
      <DialogContent className='md:max-w-md max-w-80 rounded-md'>
        <DialogHeader>
          <DialogTitle>Người đang theo dõi</DialogTitle>
        </DialogHeader>
        {followers.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Chưa có ai theo dõi bạn.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {followers.map((follower) => (
              <div key={follower} className="flex items-center justify-between space-x-4">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarFallback>{follower}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="font-semibold">User {follower}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">Theo dõi lại</Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowersModal;
