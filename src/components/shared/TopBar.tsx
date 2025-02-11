"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Bell, LogOut, Menu, Moon, Search, User, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import { Input } from '@/components/ui/input'
import LeftSideBar from './LeftSideBar'
import { getRoleTranslation } from '@/lib/utils'
import NotificationContent from '../notifications-content'
import SearchComponent from '../searchs/ExploreSearch'
import DesktopSearchComponent from '../searchs/SearchExploreDesktop'
import { useGetUnreadNotificationCount } from '@/lib/react-query/notifyQueriesAndMutation'
import RealtimeNotificationListener from '../realtime-notification-listener'

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const router = useRouter();
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: unreadCount = 0 } = useGetUnreadNotificationCount(user.accountId);
  
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality here
    console.log("Searching for:", query);
    // You can add your search logic here, such as navigating to a search results page
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  return (
    <>
    <RealtimeNotificationListener />
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


          <DesktopSearchComponent isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearch={handleSearch} ></DesktopSearchComponent>
          <div className='flex items-center gap-4'>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(true)}>
              <Search />
            </Button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-[0.5px] -right-[0.5px] flex items-center justify-center px-1 min-w-[20px] h-5 text-xs leading-none">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <NotificationContent />
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Avatar className="border-2 border-primary hover:border-primary/80 transition-all duration-300">
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
                    <Badge>{getRoleTranslation(user.role)}</Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='py-3'>
                  <Link href={"/dashboard/profile"} className='flex justify-center'>
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                className='py-3'
                onSelect={(e) => e.preventDefault()}>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center'>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Chế độ tối</span>
                    </div>
                    <Switch id="nightlight" checked={isDarkMode} onCheckedChange={toggleTheme} />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                className='py-3'
                onClick={() => {
                  signOut()
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
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 z-40 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[calc(100%-3rem)] max-w-sm bg-background shadow-lg transition-transform duration-300 ease-in-out transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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
      <SearchComponent isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearch={handleSearch} />
    </>
  )
}

export default TopBar