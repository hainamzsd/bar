"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { redirect, useRouter } from 'next/navigation'
import { useUserContext } from '@/context/AuthContext'
import { account } from '@/lib/appwrite/config'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      router.replace("/");
    }
  }, [isSuccess])


  return (
    <section className='sticky md:hidden top-0 z-50 bg-dark-2 w-full'>
      <div className='flex justify-between items-center py-4 px-5'>
        <Link href={"/"} className='flex gap-3 items-center'>
          {/* <Image
                    src={"/logo.png"}
                    alt='logo'
                    width={130}
                    height={325}
                >
                </Image> */}
          <h1>Quán Bar Otaku</h1>
        </Link>
        <div className='flex gap-4'>
          <Button onClick={() => signOut()}>
            {/* <Image
                            src=
                        ></Image> */}
            Logout
          </Button>
          {/* <div>{user.username}</div> */}
          <Avatar
            className="  border-2 border-gray-300 transition-colors 
        duration-300 hover:border-blue-400 object-fill"
          >
            <AvatarImage
              src={user?.imageUrl || 'https://github.com/shadcn.png'}
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </section>
  )
}

export default TopBar