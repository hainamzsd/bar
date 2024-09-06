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
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu'
import { LogOut, Moon, User } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { useTheme } from 'next-themes'

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const router = useRouter();
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    if (isSuccess) {
      router.replace("/");
    }
  }, [isSuccess])
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  const isDarkMode = theme === 'dark';


  return (
    <section className='top-0 z-50 bg-dark-2 w-[100%] h-[64px] fixed border-b-[1px]' style={{ borderBottomColor: 'hsl(var(--border))' }}>
      <div className='flex justify-between items-center py-3 px-5'>
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
          {/* <div>{user.username}</div> */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <Avatar
                className="border-[3px] border-gray-300 transition-colors 
        duration-300 hover:border-blue-400 object-fill"
              >
                <AvatarImage
                  src={user?.imageUrl || 'https://github.com/shadcn.png'}
                  alt="User Avatar"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-72 mr-2 mt-2 px-5 py-4'>
              <DropdownMenuLabel className='flex justify-start items-center'>
                <Avatar
                  className=" h-10 w-10 border-gray-300 transition-colors 
        duration-300 hover:border-blue-400 object-fill mr-2"
                >
                  <AvatarImage
                    src={user?.imageUrl || 'https://github.com/shadcn.png'}
                    alt="User Avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-wrap'>
                  <span>{user.username}</span>
                  <Badge>Khách hàng</Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='py-3 '>
                <div className='flex'>
                  <User className="mr-2 h-4 w-4" />
                  <span >Hồ sơ cá nhân</span>
                </div>

              </DropdownMenuItem>
              <DropdownMenuItem className='py-3 justify-between' asChild>
                <div
                  onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                  className='flex justify-between items-center w-full'
                >
                  <div className='flex items-center'>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Chế độ tối</span>
                  </div>
                  <Switch
                    id="nightlight"
                    className="bg-gray-200 dark:bg-blue-500 dark:border-blue-500"
                    checked={isDarkMode} // Switch is "on" in dark mode and "off" in light mode
                    onCheckedChange={toggleTheme} // Toggle the theme when switch is toggled
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='py-3'
                onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </section>
  )
}

export default TopBar