"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu'
import { Bell, LogOut, Menu, Moon, Search, User, X } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { useTheme } from 'next-themes'
import { Input } from '../ui/input'
import LeftSideBar from './LeftSideBar'
import NotificationContent from '../notifications-content'

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const router = useRouter();
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
  };

  return (
    <>
      <section className='top-0 z-50 w-full h-[64px] fixed border-b-[1px] bg-background' style={{ borderBottomColor: 'hsl(var(--border))' }}>
        <div className='flex justify-between items-center py-3 px-5'>
          <div className='flex items-center'>
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <Link href={"/"} className='gap-3 items-center hidden md:flex'>
              <h1 className="text-xl font-bold">Quán Bar Otaku</h1>
            </Link>
          </div>

          <div className='hidden md:flex items-center flex-1 max-w-xl mx-4'>
            <div className='relative w-full'>
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input type="text" placeholder="Search..." className="pl-10 w-full" />
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(true)}>
              <Search />
            </Button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell />
                  <Badge className="absolute -top-[0.5px] -right-[0.5px] flex items-center justify-center px-1 min-w-[20px] h-5 text-xs leading-none">
                    {3 > 99 ? '99+' : '3'}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <NotificationContent notifications={[
                {
                  id: '1',
                  avatarUrl: 'https://github.com/shadcn.png',
                  fallback: 'CN',
                  message: 'New message received',
                  time: '2 hours ago',
                },
                // Add more notifications here
              ]} />
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="border-2 border-primary">
                  <AvatarImage src={user?.imageUrl || 'https://github.com/shadcn.png'} alt="User Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-72 mr-2 mt-2 px-5 py-4'>
                <DropdownMenuLabel className='flex items-center'>
                  <Avatar className="h-10 w-10 mr-2">
                    <AvatarImage src={user?.imageUrl || 'https://github.com/shadcn.png'} alt="User Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span>{user.username}</span>
                    <Badge>Khách hàng</Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={"/dashboard/profile"} className='flex justify-center'>
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center'>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Chế độ tối</span>
                    </div>
                    <Switch id="nightlight" checked={isDarkMode} onCheckedChange={toggleTheme} />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  signOut()
                  router.replace("/");
                  }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 z-40 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-[calc(100%-3rem)] max-w-sm bg-background shadow-lg transition-transform duration-300 ease-in-out transform md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="p-4">
          <LeftSideBar isMobile={true} />
        </div>
      </div>

      {/* Mobile search overlay */}
      <div 
        className={`fixed inset-0 bg-background z-50 transition-opacity duration-300 ${
          isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="mr-2">
              <X className="h-6 w-6" />
            </Button>
            <h2 className="text-lg font-semibold">Search</h2>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="mt-4">
            {/* Add search suggestions or results here */}
            <p className="text-muted-foreground">Recent searches or suggestions can go here</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default TopBar