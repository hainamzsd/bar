"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PopChat from "@/components/VNChat";
import dynamic from "next/dynamic";
import Menu from "@/components/3D/Menu";
import { InteractiveOverlayComponent } from "@/components/3D/interactive-overlay";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";


const ModelViewer = dynamic(() => import('../../components/3D/ModelViewer') as any, {
  ssr: false,
});

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [showChat, setShowChat] = useState(false);
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
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  

  return (
    <>
      <div style={{ height: "100vh" }}>
        <ModelViewer />
        <Menu />
        <InteractiveOverlayComponent></InteractiveOverlayComponent>
        {showChat && <PopChat setShowChat={setShowChat} />}
      </div>
    </>
  );
}
