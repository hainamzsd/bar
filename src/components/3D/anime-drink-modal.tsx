"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AnimeDrinkModalProps {
  isOpen: boolean
  onClose: () => void
  drinkName: string
}

const drinkImages: { [key: string]: string } = {
  "Espresso": "https://img.freepik.com/premium-photo/white-coffee-cup-newspaper-cartoon-style_927984-402.jpg",
  "Cappuccino": "https://img.freepik.com/premium-photo/illustrated-cup-hot-cappuccino-coffee-illustration-generative-ai_846485-27040.jpg",
  "Latte": "https://i.pinimg.com/474x/73/98/58/73985824fb467547c60e576ed9ea67b0.jpg",
  "Matcha Latte": "https://131297803.cdn6.editmysite.com/uploads/1/3/1/2/131297803/s940441584922431148_p12_i1_w1920.jpeg",
  "Matcha": "https://64.media.tumblr.com/c98f6ca48ed323081fb4d60efde0f717/39734f72fdc1b4a0-25/s540x810/56ed1dfdc0c027315709c86bdabf000a79acf32f.gif"
}

export function AnimeDrinkModal({ isOpen, onClose, drinkName }: AnimeDrinkModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{drinkName} của bạn đã xong!</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <motion.img
              src={drinkImages[drinkName] || "/placeholder.svg?height=300&width=300"}
              alt={`Anime-style ${drinkName}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-white to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.8, duration: 0.5, times: [0, 0.8, 1] }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-4xl">☕️</span>
            </motion.div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg text-gray-700">Xin cảm ơn!</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}