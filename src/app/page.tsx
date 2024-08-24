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
        <div className="">
          {/* Error Message Template */}
          <div id="error-message" className="text-red-500 text-sm">
            {/* Error messages will be displayed here */}
          </div>
          {!isLogin && (
            <div className="items-center">
                <Label htmlFor="username" className="text-right">
              Tên người dùng
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Nhập tên người dùng"
              className="col-span-3"
            />
            </div>
          )}
          {/* Common Fields */}
          <div className="items-center">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="col-span-3"
            />
          </div>

          <div className="items-center">
            <Label htmlFor="password" className="text-right">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="col-span-3"
            />
          </div>

          {/* Additional Fields for Register */}
          {!isLogin && (
            <div className="items-center">
              <Label htmlFor="confirm-password" className="text-right">
                Xác nhận mật khẩu
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="********"
                className="col-span-3"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="">
          {isLogin && (
            <>
              <Button type="submit" className="mb-3 w-full"
              onClick={() => router.push('/home')}>
                Đăng nhập
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 mr-2"
                >
                  <path
                    d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.49v-9.294H9.41V11.07h3.405V8.414c0-3.368 2.05-5.201 5.049-5.201 1.437 0 2.671.107 3.031.155v3.515h-2.08c-1.629 0-1.944.774-1.944 1.91v2.502h3.878l-.506 3.635h-3.372V24h6.617c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"
                  />
                </svg>
                Đăng nhập bằng Facebook
              </Button>
            </>
          )}
            {!isLogin && (
            <>
              <Button type="submit" className="mb-3 w-full">
                Đăng ký
              </Button>
            </>
          )}
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
