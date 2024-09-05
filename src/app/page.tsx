"use client"

import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import SignInDialog from "@/components/_auth/SignInForm";
import SignUpDialog from "@/components/_auth/SignUpForm";
export default function Home() {
  const { theme, setTheme } = useTheme()
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter()
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }



  return (
    <div className="relative w-screen h-screen">
      <Image
        src={"/welcome.jpg"}
        alt="Welcome background"
        fill
        className="object-cover"
        priority
        quality={100}
      ></Image>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="absolute top-7 right-7 z-20">
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

      <div className="absolute inset-0 flex flex-col items-center
        justify-center text-center ">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4
          ">
          Chào mừng tới Quán Bar Otaku!
        </h1>
        <div className="justify-center hover:mb-8 transition-all duration-300 ease-in-out">
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Đăng nhập</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
          <DialogTitle>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</DialogTitle>
          <DialogDescription>
            {isLogin ? 'Vui lòng đăng nhập để tiếp tục.' : 'Vui lòng đăng ký để tạo tài khoản.'}
          </DialogDescription>
        </DialogHeader>
          {isLogin ? <SignInDialog></SignInDialog> :
          <SignUpDialog></SignUpDialog>}
        {/* Buttons */}
        <div className="">
          {/* Toggle Between Forms */}
          <DialogFooter className="mt-5">
            <Button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Đăng ký' : 'Quay lại Đăng nhập'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
  </Dialog>
</div>

      </div>


     
    </div>
  );
}
