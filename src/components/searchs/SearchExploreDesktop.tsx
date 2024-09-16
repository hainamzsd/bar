'use client'

import React, { useEffect, useState } from 'react'
import { Search, X, User, FileText } from 'lucide-react'
import { useSearchUserByUsername } from '@/lib/react-query/queriesAndMutations'
import { useSearchPostsByTitle } from '@/lib/react-query/postQueriesAndMutations'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'

interface SearchComponentProps {
    isOpen: boolean
    onClose: () => void
    onSearch?: (query: string) => void
  }
const DesktopSearchComponent: React.FC<SearchComponentProps> = ({ isOpen, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: posts, isLoading: isLoadingPosts } = useSearchPostsByTitle(searchQuery)
  const { data: users, isLoading: isLoadingUsers } = useSearchUserByUsername(searchQuery)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) onSearch(searchQuery)
    onClose()
  }
  return (
    <div className="hidden md:flex items-center flex-1 max-w-xl mx-4 relative">
      <div className="relative w-full">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      {/* Dropdown for search results */}
      {searchQuery && (
        <div className="absolute top-full mt-2 left-0 w-full bg-background border border-muted-foreground rounded-lg shadow-lg z-10">
          <div className="p-4 max-h-96 overflow-y-auto">
            {isLoadingUsers ? (
              <UserSkeleton />
            ) : users && users.total > 0 ? (
              <>
                <h3 className="text-sm font-semibold mb-2">Người dùng</h3>
                {users.documents.map((user) => (
                  <div key={user.id} className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
            )}

            <Separator className="my-4" />

            {isLoadingPosts ? (
              <PostSkeleton />
            ) : posts && posts.length > 0 ? (
              <>
                <h3 className="text-sm font-semibold mb-2">Bài viết</h3>
                {posts.map((post: any) => (
                  <div key={post.$id} className="flex items-center mb-2">
                    <FileText className="h-5 w-5 mr-2" />
                    <span>{post.caption}</span>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-muted-foreground">Không tìm thấy bài viết nào</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const UserSkeleton = () => (
  <>
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center mb-2">
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    ))}
  </>
)

const PostSkeleton = () => (
  <>
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center mb-2">
        <Skeleton className="h-5 w-5 mr-2" />
        <Skeleton className="h-4 w-48" />
      </div>
    ))}
  </>
)

export default DesktopSearchComponent
