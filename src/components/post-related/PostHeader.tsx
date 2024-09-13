import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon } from 'lucide-react'
import { CardHeader } from '../ui/card'
import { useUserContext } from '@/context/AuthContext'
import { IUser } from '@/types'
import { formatTimeDifference } from '@/lib/utils'

type PostProps = {
  date: string;
  username: string;
  avatar: string;
};
export default function PostHeader({date, username,avatar}:PostProps) {
  console.log(username)
  return (
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="rounded-full">
        <AvatarImage src={avatar} alt="User avatar" />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm font-semibold">{username}</p>
        <p className="text-xs text-muted-foreground">{formatTimeDifference(date)}</p>
      </div>
      <Button variant="ghost" size="icon" className="ml-auto">
        <MoreHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">More options</span>
      </Button>
    </CardHeader>
  )
}
