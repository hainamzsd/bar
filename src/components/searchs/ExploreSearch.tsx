'use client'

import React, { useState, useEffect } from 'react'
import { Search, X, User, FileText } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useSearchUserByUsername } from '@/lib/react-query/queriesAndMutations'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import { PostFromAPI } from '@/types/post'
import { useSearchPostsByTitle } from '@/lib/react-query/postQueriesAndMutations'

interface SearchComponentProps {
  isOpen: boolean
  onClose: () => void
  onSearch?: (query: string) => void
}

const SearchComponent: React.FC<SearchComponentProps> = ({ isOpen, onClose, onSearch }) => {
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
    <div 
      className={`fixed inset-0 bg-background z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="mt-4 max-h-[calc(100vh-150px)] overflow-y-auto">
          {searchQuery && (
            <>
              {isLoadingUsers ? (
                <UserSkeleton />
              ) : users && users.total > 0 ? (
                users.documents.map((user) => (
                  <>
              <h3 className="text-sm font-semibold mb-2">Người dùng</h3>
                  
                  <div key={user.id} className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </div>
                  </>

                ))
              ) : (
                <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
              )}

              <Separator className="my-4" />

              {isLoadingPosts ? (
                <PostSkeleton />
              ) : posts && posts.length > 0 ? (
                posts.map((post:any) => (
                  <>
              <h3 className="text-sm font-semibold mb-2">Bài viết</h3>
                  <div key={post.$id} className="flex items-center mb-2">
                    <FileText className="h-5 w-5 mr-2" />
                    <span>{post.caption}</span>
                  </div>
                  </>
                ))
              ) : (
                <p className="text-muted-foreground">Không tìm thấy bài viết nào</p>
              )}
            </>
          )}
        </div>
      </div>
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

export default SearchComponent