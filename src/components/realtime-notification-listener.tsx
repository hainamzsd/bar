'use client'

import { useEffect, useRef, useState } from 'react'
import { client, databases, appwriteConfig } from '@/lib/appwrite/config'
import { INotificationFromAPI } from '@/types'
import { useUserContext } from '@/context/AuthContext'
import { useQueryClient } from '@tanstack/react-query'

function RealtimeNotificationListener() {
  const { user } = useUserContext()
  const queryClient = useQueryClient()
  const hasSubscribedRef = useRef(false)
  const pendingUpdatesRef = useRef<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (hasSubscribedRef.current) return

    hasSubscribedRef.current = true

    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.notificationCollectionId}.documents`,
      (response) => {
        console.log('Notification event:', response)
        if (response.events.includes(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.notificationCollectionId}.documents.*.create`)) {
          const notificationId = (response.payload as { $id: string }).$id
          pendingUpdatesRef.current.push(notificationId)
          processUpdates()
        }
      }
    )

    return () => {
      hasSubscribedRef.current = false
      unsubscribe()
    }
  }, [user.accountId])

  const processUpdates = async () => {
    if (isUpdating) return

    setIsUpdating(true)

    const batchSize = 5
    const newNotifications: INotificationFromAPI[] = []

    while (pendingUpdatesRef.current.length > 0 && newNotifications.length < batchSize) {
      const notificationId = pendingUpdatesRef.current.shift()
      if (notificationId) {
        try {
          const fullNotification = await databases.getDocument(
            appwriteConfig.databaseId as string,
            appwriteConfig.notificationCollectionId as string, 
            notificationId
          ) 

          if (fullNotification.userId === user.accountId) {
            newNotifications.push(fullNotification as any)
          }
        } catch (error) {
          console.error("Error fetching full notification:", error)
          // Optionally, implement retry logic here
        }
      }
    }

    if (newNotifications.length > 0) {
      queryClient.setQueryData<INotificationFromAPI[]>(['notifications', user.accountId], (oldData) => {
        if (oldData) {
          return [...newNotifications, ...oldData]
        }
        return newNotifications
      })

      // Update unread notification count
      queryClient.setQueryData<number>(['unreadNotificationCount', user.accountId], (oldCount) => {
        return (oldCount || 0) + newNotifications.length
      })
    }

    setIsUpdating(false)

    if (pendingUpdatesRef.current.length > 0) {
      setTimeout(processUpdates, 1000) // Process next batch after 1 second
    }
  }

  return null
}

export default RealtimeNotificationListener