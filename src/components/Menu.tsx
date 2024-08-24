"use client"
import React from 'react'
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
import { Moon, Sun } from 'lucide-react';

export default function Menu() {
  const { theme, setTheme } = useTheme()
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
      <div className='absolute top-7 right-7'>
      <DropdownMenu>
  <DropdownMenuTrigger className={`flex justify-center items-center p-2
    ${theme === 'light' ? 'bg-white' : 'bg-[#1E293B]'}
    shadow-md rounded-md
    ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-700'}
    transition-colors duration-300 
    `}>
  <Avatar
        className="  border-4 border-gray-300 transition-colors 
        duration-300 hover:border-blue-500"
      >
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="User Avatar"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Label className='ml-3'>Hai Nam</Label>
  </DropdownMenuTrigger>
  <DropdownMenuContent >
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
      </div>
     
  </>
  )
}
