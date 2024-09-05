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
import { Bell, LogOut, Moon, Sun, User } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,  SheetClose } from './ui/sheet';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import Profile from './Profile';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';

export default function Menu() {
  const { theme, setTheme } = useTheme()
  const router = useRouter();
const [role, setRole] = useState<string>('Customer');
const {user} = useUserContext();
const { mutate: signOut, isSuccess } = useSignOutAccount();
useEffect(() => {
  if(isSuccess){
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
        <DropdownMenu>
          <DropdownMenuTrigger className='mr-4'
          >
            <Button
              variant="outline"
              size="icon"
            >
              <Bell className={`h-[1.2rem] w-[1.2rem] `} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mt-4 mr-20'>
          <DropdownMenuLabel className='text-lg font'>Thông báo</DropdownMenuLabel>
            <DropdownMenuItem className="flex items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 w-full max-w-xs md:max-w-md lg:max-w-lg">
              <Avatar className="w-10 h-10 mr-3">
                <AvatarImage src={`  https://github.com/shadcn.png`} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">New message received</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
            <Sheet>
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
          <DropdownMenuContent >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
      <SheetTrigger asChild>
        <div className='flex'>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
        </div>
      </SheetTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
       <Profile/>
    </Sheet>

      </div>

    </>
  )
}
