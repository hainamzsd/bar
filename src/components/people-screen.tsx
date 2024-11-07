'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Filter, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { databases, appwriteConfig } from '@/lib/appwrite/config'
import { IUser } from "@/types"
import { updateUser } from '@/lib/appwrite/api'
import { Query } from 'appwrite'

const USERS_PER_PAGE = 9

export function PeopleScreenComponent() {
  const [filter, setFilter] = useState<'all' | 'customer' | 'staff'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  const { data: users, isLoading, error } = useQuery<any[]>({
    queryKey: ['users', filter, searchTerm, currentPage],
    queryFn: async () => {
      const queries = [Query.limit(USERS_PER_PAGE), Query.offset((currentPage - 1) * USERS_PER_PAGE)]
      
      if (filter !== 'all') {
        queries.push(Query.equal('role', filter))
      }
      
      if (searchTerm) {
        queries.push(Query.search('username', searchTerm))
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId as string,
        appwriteConfig.userCollectionId as string,
        queries
      )
      return response.documents as any[]
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: (userData: { userId: string; data: Partial<IUser> }) => 
      updateUser(userData.userId, userData.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleUpdateUser = (userId: string, data: Partial<IUser>) => {
    updateUserMutation.mutate({ userId, data })
  }

  const PersonCard = ({ person }: { person: IUser }) => (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={person.imageUrl} alt={person.username} />
              <AvatarFallback>{person.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{person.username}</p>
              <p className="text-sm text-muted-foreground truncate">@{person.username}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
          <Skeleton className="h-9 w-[60px]" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row">
        <h1 className="text-3xl font-bold">Mọi người</h1>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Input
            placeholder="Tìm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Lọc
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>Tất cả</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('customer')}>Khách hàng</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('staff')}>Nhân viên</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array(USERS_PER_PAGE).fill(0).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-lg font-semibold text-red-600">Lỗi tải người dùng</h2>
          <p className="mt-2 text-muted-foreground">Hãy thử lại sau.</p>
        </div>
      ) : users && users.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {users.map(user => (
              <PersonCard key={user.$id} person={user} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">Không tìm thấy người dùng</h2>
          <p className="mt-2 text-muted-foreground">Hãy thử thay đổi filter của bạn.</p>
        </div>
      )}

      <div className="mt-8 flex justify-center items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Trước
        </Button>
        <span className="text-sm font-medium">Trang {currentPage}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={!users || users.length < USERS_PER_PAGE || isLoading}
        >
          Sau
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

export default PeopleScreenComponent
