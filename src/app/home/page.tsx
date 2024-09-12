"use client";
import React, { useState } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import Menu from "@/components/Menu";
import PopChat from "@/components/VNChat";
import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import('../../components/ModelViewer') as any, {
  ssr: false,
});

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [showChat, setShowChat] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <Head>
        <title>3D Model Viewer</title>
      </Head>
      <div style={{ height: "100vh" }}>
        <ModelViewer />
        <Menu />
        {showChat && <PopChat setShowChat={setShowChat} />}
      </div>
    </>
  );
}
