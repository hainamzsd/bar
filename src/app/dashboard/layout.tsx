import BottomBar from '@/components/shared/BottomBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import TopBar from '@/components/shared/TopBar'
import React from 'react'

type Props = {}

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='w-full md:flex'>
        <TopBar></TopBar>
        <LeftSideBar></LeftSideBar>
        <section className='flex flex-1 h-full'>
            {children}
        </section>
        <BottomBar></BottomBar>
    </div>
  )
}

export default Layout