"use client"

import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const menuContainerVariants = {
  open: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
}

const menuItemVariants = {
  hidden: {
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0,
  },
  visible: (index: number) => ({
    x: Math.cos((index * (2 * Math.PI)) / 3) * 80,
    y: Math.sin((index * (2 * Math.PI)) / 3) * 80,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  }),
  exit: {
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CircularMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  menuItems: MenuItem[];
}

export function CircularMenu({ isOpen, setIsOpen, menuItems }: CircularMenuProps) {
  return (
    <motion.div
      variants={menuContainerVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="relative w-48 h-48 rounded-full flex items-center justify-center"
    >
      <Button
        className="z-10 size-12 p-2 flex items-center justify-center cursor-pointer bg-primary text-primary-foreground rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen &&
          menuItems.map((item, index) => (
            <motion.div
              key={index}
              className="absolute w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-full"
              custom={index}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={item.action}
            >
              {item.icon}
            </motion.div>
          ))}
      </AnimatePresence>
    </motion.div>
  )
}