"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900">
      <motion.div
        className="relative w-64 h-64 mb-8"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
      >
        <img
          src="/loading.gif" // Update with the path to your GIF file
          alt="Loading Animation"
          className="w-full h-full object-contain"
        />
      </motion.div>
      <h1 className="text-4xl font-bold mb-4 text-pink-600 dark:text-pink-300" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
        Đang tải...
      </h1>
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-pink-600 dark:text-pink-300" />
        <p className="text-lg text-pink-600 dark:text-pink-300">Chờ chút nhé!</p>
      </div>
      <div className="mt-8 flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-4 h-4 rounded-full bg-pink-400 dark:bg-pink-600"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity,
              delay: index * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}
