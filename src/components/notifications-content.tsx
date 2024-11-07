'use client'

import React, { useEffect } from 'react'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from './ui/skeleton'
import { useUserContext } from '@/context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useGetAllNotifications, useMarkNotificationAsRead } from '@/lib/react-query/notifyQueriesAndMutation'
import { INotificationFromAPI } from '@/types'

const NotificationContent = () => {
  const { user } = useUserContext()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useGetAllNotifications(user.accountId)
  const { mutate: markAsRead } = useMarkNotificationAsRead()
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId)
    // Add any additional logic here (e.g., navigation)
  }

  return (
    <DropdownMenuContent className="mt-4 w-72 md:w-96 max-h-[80vh] overflow-y-auto">
      <DropdownMenuLabel className="text-lg font-semibold p-4">Thông báo</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {status === 'pending' ? (
        <>
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </>
      ) : status === 'error' ? (
        <DropdownMenuItem className="text-center text-red-500">
          Đã xảy ra lỗi khi tải thông báo.
        </DropdownMenuItem>
      ) : (
        <>
          {data?.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.map((notification: INotificationFromAPI) => (
                <DropdownMenuItem
                  key={notification.$id}
                  className="flex items-center p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 cursor-pointer"
                  onClick={() => handleNotificationClick(notification.$id)}
                >
                  <Avatar className="w-10 h-10 mr-3">
                    <AvatarImage src={notification.sender.imageUrl} />
                    <AvatarFallback>{notification.sender.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(notification.$createdAt), { addSuffix: true, locale: vi })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" aria-hidden="true" />
                  )}
                </DropdownMenuItem>
              ))}
            </React.Fragment>
          ))}
          {hasNextPage && (
            <div ref={ref} className="p-4 text-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                variant="outline"
                size="sm"
              >
                {isFetchingNextPage ? 'Đang tải...' : 'Tải thêm'}
              </Button>
            </div>
          )}
        </>
      )}
      {data?.pages[0]?.length === 0 && (
        <DropdownMenuItem className="text-center text-gray-500 p-4">
          Không có thông báo nào.
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  )
}

const NotificationSkeleton = () => (
  <div className="flex items-center p-4">
    <Skeleton className="w-10 h-10 rounded-full mr-3" />
    <div className="flex-1">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
)

export default NotificationContent