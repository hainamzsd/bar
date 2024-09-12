"use client"
import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Bell, LayoutList, LogOut, Moon, Sun, User } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '../ui/sheet';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import Profile from '../Profile';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';
import NotificationContent from '../notifications-content';
import Link from 'next/link';
import { Badge } from '../ui/badge';

export default function Menu() {
  const { theme, setTheme } = useTheme()
  const router = useRouter();
  const [role, setRole] = useState<string>('Customer');
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  useEffect(() => {
    if (isSuccess) {
      router.replace("/");
    }
  }, [isSuccess])
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  return (
    <>
      <div className="absolute top-7 left-7  z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </div>
      <div className='absolute top-7 right-7 flex items-start'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className='mr-4' asChild>
            <Button
            variant={'secondary'}
              size="icon"
            >
              <Bell className={`h-[1.2rem] w-[1.2rem] `} />
            </Button>
          </DropdownMenuTrigger>
        <NotificationContent   notifications={[
    {
      id: '1',
      avatarUrl: 'https://github.com/shadcn.png',
      fallback: 'CN',
      message: 'New message received',
      time: '2 hours ago',
    },
    // Add more notifications here
  ]}></NotificationContent>
        </DropdownMenu>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className={`flex justify-center items-center p-2
    ${theme === 'light' ? 'bg-white' : 'bg-[#1E293B]'}
    shadow-md rounded-md
    ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-700'}
    transition-colors duration-300 
    `}>
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
              <Label className='ml-3'>{user?.username}</Label>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mr-2 mt-2 px-5 py-4'>
            <DropdownMenuLabel className='flex items-center'>
                  <Avatar className="h-10 w-10 mr-2">
                    <AvatarImage src={user?.imageUrl || 'https://github.com/shadcn.png'} alt="User Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span>{user.username}</span>
                    <Badge variant={'default'} >Khách hàng</Badge>
                  </div>
                </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                  <Link href='/dashboard/profile' className='flex'>
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                  <Link href='/dashboard/explore' className='flex'>
                    <LayoutList className="mr-2 h-4 w-4" />
                    <span>Đi tới bảng tin</span>
                  </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

    </>
  )
}
