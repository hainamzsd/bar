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
import { actions, mainNavigate, references } from '@/constants'
import { INavLink } from '@/types'
import { Separator } from '../ui/separator'
import { Label } from '@radix-ui/react-label'
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
    <nav className='hidden md:flex fixed top-[64px] left-0 h-full z-40 w-[270px] px-6  flex-col justify-between
    border-r-[1px] 
    ' style={{borderRightColor: 'hsl(var(--border))'}}>
      <div className='flex flex-col'>
        <ul className='mt-3'>
          {mainNavigate.map((link: INavLink) => {
            const isActive = pathname === link.route
            return (
              <li className='rounded-lg text-[16px] font-medium leading-[140%] transition'
                key={link.label}>
                <Link href={link.route} className=''>
                <Button 
                variant={isActive ? 'default' : 'ghost'}  // Dynamically set variant based on isActive
                className='w-full justify-start'
              >
                <link.icon className='mr-2' size={20} /> {/* Render icon */}
                {link.label}
              </Button>
                </Link>
              </li>
            )
          })}
            <Separator className='mt-3'></Separator>
            <li className='my-3 text-secondary-foreground'>HÀNH ĐỘNG</li>
            {actions.map((link: INavLink) => {
            const isActive = pathname === link.route
            return (
              <li className='rounded-lg text-[16px] font-medium leading-[140%] transition'
                key={link.label}>
                <Link href={link.route} className=''>
                <Button 
                variant={isActive ? 'default' : 'ghost'}  // Dynamically set variant based on isActive
                className='w-full justify-start'
              >
                <link.icon className='mr-2' size={20} /> {/* Render icon */}
                {link.label}
              </Button>
                </Link>
              </li>
            )
          })}
            <Separator className='mt-3'></Separator>
            <li className='my-3 text-secondary-foreground'>TÀI NGUYÊN</li>
            {references.map((link: INavLink) => {
            const isActive = pathname === link.route
            return (
              <li className='rounded-lg text-[16px] font-medium leading-[140%] transition'
                key={link.label}>
                <Link href={link.route} className=''>
                <Button 
                variant={isActive ? 'default' : 'ghost'}  // Dynamically set variant based on isActive
                className='w-full justify-start'
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