import BottomBar from '@/components/shared/BottomBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import TopBar from '@/components/shared/TopBar'
import React, { Suspense } from 'react'
import Loading from './loading'

type Props = {}

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='w-full md:flex'>
        <TopBar></TopBar>
        <LeftSideBar></LeftSideBar>
        <section  className='flex-1 md:ml-[270px] mt-[64px] p-4 bg-primary-foreground h-screen'>
            <Suspense fallback={<Loading></Loading>}>
            {children}

            </Suspense>
        </section>
        {/* <BottomBar></BottomBar> */}
    </div>
  )
}

export default Layout