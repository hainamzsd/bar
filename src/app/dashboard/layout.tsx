"use client"
import BottomBar from '@/components/shared/BottomBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import TopBar from '@/components/shared/TopBar'
import React, { Suspense, useEffect } from 'react'
import Loading from './loading'
import { useUserContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

type Props = {}

const Layout = ({children}: {children: React.ReactNode}) => {
  const { isAuthenticated, isLoading } = useUserContext();
  const router = useRouter();
  const {toast} = useToast();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
        toast({
          variant:'destructive',
          title:"Chưa đăng nhập"
        })
        router.push('/'); // Redirect to homepage if not authenticated
    }
}, [isAuthenticated, isLoading, router]);
  return (
    <div className='w-full md:flex'>
            <Suspense fallback={<Loading></Loading>}>

        <TopBar></TopBar>
        <LeftSideBar></LeftSideBar>
        <section  className='flex-1 md:ml-[270px] mt-[64px] p-4 bg-primary-foreground h-screen'>
            {children}

        </section>
            </Suspense>
            {/* <BottomBar></BottomBar> */}
    </div>
  )
}

export default Layout