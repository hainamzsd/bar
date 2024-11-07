"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Trophy, Coffee, Lock, Menu } from "lucide-react"
import { useToast } from '@/hooks/use-toast'
import { ElegantMenuComponent } from './elegant-menu'
import { DrinkChallengeModalComponent } from './drink-challenge-modal'

const puzzleHints = [
  "The first letter is the same as the last letter of 'espresso'.",
  "It rhymes with 'team'.",
  "It's a coffee lover's ____. ",
]

export function InteractiveOverlayComponent() {
  const [isPuzzleOpen, setIsPuzzleOpen] = useState(false)
  const [puzzleInput, setPuzzleInput] = useState("")
  const [currentHint, setCurrentHint] = useState(0)
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false)
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const { toast } = useToast()
  const [achievements, setAchievements] = useState([
    { name: "Puzzle Master", unlocked: false },
    { name: "First Order", unlocked: false },
  ])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handlePuzzleSubmit = () => {
    if (puzzleInput.toLowerCase() === "dream") {
      setIsPuzzleSolved(true)
      toast({
        title: "Congratulations! You've solved the puzzle!",
      })
      setAchievements(prev => prev.map(a => a.name === "Puzzle Master" ? { ...a, unlocked: true } : a))
    } else {
      toast({
        title: "That's not quite right. Try again!",
      })
    }
  }

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

  const menuItems = [
    { name: "Puzzle", icon: <Lock className="h-[1.2rem] w-[1.2rem]" />, action: () => setIsPuzzleOpen(true) },
    { name: "Coffee", icon: <Coffee className="h-[1.2rem] w-[1.2rem]" />, action: () => setIsOrderOpen(true) },
    { name: "Achievements", icon: <Trophy className="h-[1.2rem] w-[1.2rem]" />, action: () => {} },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-10 right-7 pointer-events-auto">
        <motion.div
          variants={menuContainerVariants}
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          className="relative w-48 h-48 rounded-full flex items-center justify-center"
        >
          <Button
            className="z-10 size-12 p-2 flex items-center justify-center cursor-pointer bg-primary text-primary-foreground rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <AnimatePresence>
            {isMenuOpen &&
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
      </div>

      {/* Puzzle dialog */}
      <Dialog open={isPuzzleOpen} onOpenChange={setIsPuzzleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solve the Puzzle</DialogTitle>
            <DialogDescription>
              Unravel the mystery to unlock a special achievement!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>Hint: {puzzleHints[currentHint]}</p>
            <Input
              value={puzzleInput}
              onChange={(e) => setPuzzleInput(e.target.value)}
              placeholder="Enter your answer"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setCurrentHint(prev => (prev + 1) % puzzleHints.length)}>
              Next Hint
            </Button>
            <Button onClick={handlePuzzleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order dialog */}
      <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
        <ElegantMenuComponent />
      </Dialog>

      {/* Achievements dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="hidden">Achievements Trigger</div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Achievements</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {achievements.map(achievement => (
              <div key={achievement.name} className="flex items-center space-x-2">
                {achievement.unlocked ? (
                  <Trophy className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
                <span>{achievement.name}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}