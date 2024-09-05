"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { redirect, usePathname, useRouter } from 'next/navigation'
import { useUserContext } from '@/context/AuthContext'
import { account } from '@/lib/appwrite/config'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
const LeftSideBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname)
  useEffect(() => {
    if (isSuccess) {
      router.replace("/");
    }
  }, [isSuccess])

  return (
    <nav className='hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px]'>
      <div className='flex flex-col gap-11'>
        <Link href={"/"} className='flex gap-3 items-center'>
          {/* <Image
                    src={"/logo.png"}
                    alt='logo'
                    width={130}
                    height={325}
                >
                </Image> */}
          <h1 className='text-xl font-bold'>Quán Bar Otaku</h1>
        </Link>
        <Link className='flex gap-3 items-center'
          href={"/"}
        >
          <Avatar
            className="w-16 h-16 border-2 border-gray-300 transition-colors 
        duration-300 hover:border-blue-400 object-fill"
          >
            <AvatarImage
              src={user?.imageUrl || 'https://github.com/shadcn.png'}
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <p className='text-[18px] font-bold leading-[140%]'>
              {user.username}
            </p>
            <p className='text-[14px] font-normal leading-[140%] text-gray-500'>
              @${user.id}
            </p>
          </div>
        </Link>
        <ul>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route
            return (
              <li className='rounded-lg text-[16px] font-medium leading-[140%] transition
              py-3
              '
                key={link.label}>
                <Link href={link.route} className=''>
                <Button 
                variant={isActive ? 'default' : 'ghost'}  // Dynamically set variant based on isActive
                className='w-32 justify-start'
              >
                <link.icon className='mr-2' size={20} /> {/* Render icon */}
                {link.label}
              </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default LeftSideBar