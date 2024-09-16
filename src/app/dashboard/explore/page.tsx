"use client"
import ExplorePage from '@/components/explore-page'
import LeftSideBar from '@/components/shared/LeftSideBar'
import TopBar from '@/components/shared/TopBar'
import { NextApiRequest } from 'next'
import React, { useEffect, useState } from 'react'
type Props = {}

const page = (props: Props) => {
  return (
    <ExplorePage></ExplorePage>
  )
}

export default page