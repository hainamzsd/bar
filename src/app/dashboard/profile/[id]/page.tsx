"use client"

import React from 'react'
import { IUser } from '@/types'
import { PuffLoader } from 'react-spinners'
import { useGetUserById } from '@/lib/react-query/queriesAndMutations'
import { OtherUserProfileComponent } from '@/components/profile/other-user-profile'

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { data: user, isLoading, isError } = useGetUserById(params.id)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader color="hsl(var(--primary))" size={100} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error loading user profile. Please try again later.</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">User not found.</p>
      </div>
    )
  }

  return <OtherUserProfileComponent user={user as any} />
}