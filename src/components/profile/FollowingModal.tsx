import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface FollowingModalProps {
  showFollowingModal: boolean;
  setShowFollowingModal: (open: boolean) => void;
  following: string[];
}

const FollowingModal: React.FC<FollowingModalProps> = ({ showFollowingModal, setShowFollowingModal, following }) => {
  return (
    <Dialog open={showFollowingModal} onOpenChange={setShowFollowingModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="mr-2 h-4 w-4" />
          {following.length} Đang theo dõi
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đang theo dõi</DialogTitle>
        </DialogHeader>
        {following.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Chưa theo dõi ai.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {following.map((user) => (
              <div key={user} className="flex items-center justify-between space-x-4">
                <Avatar>
                  <AvatarFallback>U{user}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">User {user}</p>
                  <p className="text-sm text-muted-foreground">@user{user}</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">Bỏ theo dõi</Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowingModal;
