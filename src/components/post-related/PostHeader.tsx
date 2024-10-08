'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { CardHeader } from '../ui/card'
import { useUserContext } from '@/context/AuthContext'
import { formatTimeDifference } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PostHeaderProps = {
  date: string;
  username: string;
  avatar: string;
  creatorId: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PostHeader({date, username, avatar, creatorId, onEdit, onDelete}: PostHeaderProps) {
  const { user } = useUserContext();
  console.log(creatorId)
  console.log("current user" + user.accountId )
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
      {user.accountId === creatorId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </CardHeader>
  )
}