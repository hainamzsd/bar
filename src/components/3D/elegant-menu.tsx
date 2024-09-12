"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { DialogContent } from '../ui/dialog'

const menuCategories = [
  {
    name: "Coffee",
    items: [
      { name: "Espresso", price: 30000 },
      { name: "Cappuccino", price: 45000 },
      { name: "Latte", price: 50000 },
    ]
  },
  {
    name: "Tea",
    items: [
      { name: "Matcha Latte", price: 55000 },
      { name: "Earl Grey", price: 40000 },
      { name: "Jasmine Green", price: 35000 },
    ]
  },
  {
    name: "Specials",
    items: [
      { name: "Sakura Blossom Frappe", price: 65000 },
      { name: "Yuzu Citrus Sparkler", price: 60000 },
      { name: "Hojicha Cream Cold Brew", price: 70000 },
    ]
  }
]

const MenuItem = ({ item }: { item: { name: string; price: number } }) => (
  <motion.div 
    className="flex justify-between items-center py-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <span className="text-lg font-medium">{item.name}</span>
    <span className="text-lg font-light">{item.price.toLocaleString()} ₫</span>
  </motion.div>
)

const MenuCategory = ({ category }: { category: { name: string; items: { name: string; price: number }[] } }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        className="w-full justify-between text-lg font-semibold mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {category.name}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {category.items.map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Separator className="mt-4" />
    </div>
  )
}

export function ElegantMenuComponent() {
  return (
    <DialogContent className="backdrop-blur-md p-8 rounded-lg shadow-lg 
     max-w-80 md:max-w-lg mx-auto font-sans" >
      <h2 className="text-3xl font-bold mb-6 text-center ">Café Menu</h2>
      <div className="space-y-6 max-h-80 overflow-auto">
        {menuCategories.map((category) => (
          <MenuCategory key={category.name} category={category} />
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>All prices are in Vietnamese Dong (₫)</p>
        <p className="mt-2">Enjoy your stay at our anime-inspired café!</p>
      </div>
    </DialogContent>
  )
}