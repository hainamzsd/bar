"use client"

import React, { useState, useRef } from 'react'
import { Trophy, Coffee, Lock, Music } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"
import { CircularMenu } from './circular-menu'
import { PuzzleDialog } from './puzzle-dialog'
import { AchievementsDialog } from './achievements-dialog'
import MP3Player from './mp3-player'
import { ElegantMenuComponent } from '../elegant-menu'

export function InteractiveOverlayComponent() {
  const [isPuzzleOpen, setIsPuzzleOpen] = useState(false)
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMusicVisible, setIsMusicVisible] = useState(false)
  const [achievements, setAchievements] = useState([
    { name: "Puzzle Master", unlocked: false },
    { name: "First Order", unlocked: false },
  ])

  const achievementsTriggerRef = useRef<HTMLDivElement>(null)

  const handlePuzzleSolved = () => {
    setAchievements(prev => prev.map(a => a.name === "Puzzle Master" ? { ...a, unlocked: true } : a))
  }

  const menuItems = [
    { name: "Puzzle", icon: <Lock className="h-[1.2rem] w-[1.2rem]" />, action: () => setIsPuzzleOpen(true) },
    { name: "Coffee", icon: <Coffee className="h-[1.2rem] w-[1.2rem]" />, action: () => setIsOrderOpen(true) },
    { name: "Achievements", icon: <Trophy className="h-[1.2rem] w-[1.2rem]" />, action: () => achievementsTriggerRef.current?.click() },
    { name: "Music", icon: <Music className="h-[1.2rem] w-[1.2rem]" />, action: () => setIsMusicVisible(!isMusicVisible) },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-24 right-4 pointer-events-auto">
        <CircularMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} menuItems={menuItems} />
      </div>

      <PuzzleDialog isOpen={isPuzzleOpen} setIsOpen={setIsPuzzleOpen} onPuzzleSolved={handlePuzzleSolved} />

      <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
        <ElegantMenuComponent />
      </Dialog>

      <AchievementsDialog achievements={achievements} triggerRef={achievementsTriggerRef} />

      {isMusicVisible && <MP3Player />}
    </div>
  )
}