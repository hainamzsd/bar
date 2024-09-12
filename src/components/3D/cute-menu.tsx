"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { DialogContent } from '../ui/dialog'

const menuItems = [
  { name: "Espresso", price: 10000 },
  { name: "Cappuccino", price: 15000 },
  { name: "Matcha Latte", price: 18000 },
  { name: "Strawberry Milk", price: 20000 },
  { name: "Chocolate Mocha", price: 22000 },
]

export function CuteMenuComponent() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  return (
    <DialogContent className="bg-pink-100 p-8 rounded-3xl shadow-lg max-w-md mx-auto font-cute relative overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
        .font-cute { font-family: 'Indie Flower', cursive; }
      `}</style>
      
      <h2 className="text-4xl text-center mb-6 text-pink-600 font-bold">Kawaii Menu</h2>
      
      <motion.img 
        src="/placeholder.svg?height=100&width=100" 
        alt="Cute anime mascot" 
        className="absolute top-4 right-4 w-24 h-24 object-contain"
        initial={{ rotate: -10 }}
        animate={{ rotate: 10 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />

      <ul className="space-y-4">
        {menuItems.map((item) => (
          <motion.li 
            key={item.name}
            className={cn(
              "flex justify-between items-center text-2xl p-2 rounded-full transition-colors duration-300",
              selectedItem === item.name ? "bg-pink-200" : "hover:bg-pink-200"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedItem(item.name)}
          >
            <span className="flex-grow">{item.name}</span>
            <span className="flex-shrink-0 w-32 text-right">
              {item.price.toLocaleString()} đồng
            </span>
            {selectedItem === item.name && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                layoutId="underline"
              />
            )}
          </motion.li>
        ))}
      </ul>

      <motion.div 
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-300 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </DialogContent>
  )
}