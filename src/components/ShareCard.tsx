import React from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { IShare } from '@/types'
import { formatTimeDifference } from '@/lib/utils'
import { PostCard } from '@/components/post-related/post-card'
import { useUnsharePost } from '@/lib/react-query/shareQueiresAndMutations'

interface ShareCardProps {
  share: any
  currentUserId: string
}

const ShareCard: React.FC<ShareCardProps> = ({ share, currentUserId }) => {
  const unsharePost = useUnsharePost()

  const handleUnshare = () => {
    if (window.confirm('Are you sure you want to unshare this post?')) {
      unsharePost.mutate({ shareId: share.$id!, postId: share.post, userId: currentUserId })
    }
  }

  return (
    <Card className="w-full mb-4">
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <Avatar className="h-10 w-10 mr-2">
            <AvatarImage src={share.user.imageUrl} />
            <AvatarFallback>{share.user.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{share.user.username}</p>
            <p className="text-sm text-muted-foreground">{formatTimeDifference(share.$createdAt!)}</p>
          </div>
        </div>
        {share.comment && (
          <p className="mb-4 text-sm">{share.comment}</p>
        )}
        <div className="border rounded-lg p-4">
          <PostCard post={share.post} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        {currentUserId === share.user && (
          <Button variant="outline" onClick={handleUnshare}>
            Unshare
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ShareCard