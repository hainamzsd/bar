"use client"

import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Coffee, Calendar, Users, Star } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";
import SignInDialog from "@/components/_auth/SignInForm";
import SignUpDialog from "@/components/_auth/SignUpForm";

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter()
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const features = [
    { icon: Coffee, title: "Unique Drinks", description: "Enjoy our anime-inspired beverage menu" },
    { icon: Calendar, title: "Events", description: "Join our weekly anime screenings and cosplay contests" },
    { icon: Users, title: "Community", description: "Meet fellow otaku and make new friends" },
    { icon: Star, title: "Rewards", description: "Earn points and unlock exclusive perks" },
  ];

  return (
    <div className="relative w-screen h-screen overflow-x-hidden">
      <Image
        src={"/welcome.jpg"}
        alt="Welcome background"
        fill
        className="object-cover"
        priority
        quality={100}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
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

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0. }}
        >
          Chào mừng tới Quán Bar Otaku!
        </motion.h1>
        <motion.p 
          className="text-md mb-8 max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Nơi hội tụ của những tâm hồn đam mê anime và manga. Hãy thưởng thức đồ uống độc đáo và giao lưu cùng cộng đồng otaku sôi động!
        </motion.p>
        
        <motion.div 
          className="flex space-x-4 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Đăng nhập</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</DialogTitle>
                <DialogDescription>
                  {isLogin ? 'Vui lòng đăng nhập để tiếp tục.' : 'Vui lòng đăng ký để tạo tài khoản.'}
                </DialogDescription>
              </DialogHeader>
              {/* Commented out as requested */}
              {isLogin ? <SignInDialog /> : <SignUpDialog />}
              <DialogFooter className="mt-5">
                <Button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Đăng ký' : 'Quay lại Đăng nhập'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto hidden md:grid">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
    className="absolute bottom-0 w-full flex items-center justify-center text-white text-sm text-center pb-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 1 }}
  >
    <p>© 2023 Quán Bar Otaku. All rights reserved.</p>
  </motion.div>
    </div>
  );
}