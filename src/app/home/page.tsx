"use client"
import React from 'react'
import Head from 'next/head';
import { ModelViewer } from '../../components/ModelViewer';
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
import Menu from '@/components/Menu';

export default function Page() {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <>
    <Head>
      <title>3D Model Viewer</title>
    </Head>
    <div style={{ height: '100vh' }}>
      <ModelViewer />
      <Menu />
     
    </div>
  </>
  )
}
