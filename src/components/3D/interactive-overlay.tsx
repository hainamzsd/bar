"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Trophy, Coffee, Lock } from "lucide-react"
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

  // const handleOrderSubmit = () => {
  //   if (selectedDrink) {
  //     setIsOrderOpen(false)
  //     toast({
  //       title: `Your ${selectedDrink} is being prepared!`,
  //     })
  //     if (!achievements.find(a => a.name === "First Order").unlocked) {
  //       setAchievements(prev => prev.map(a => a.name === "First Order" ? { ...a, unlocked: true } : a))
  //     }
  //   }
  // }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Button stack */}
      <div className="absolute bottom-10 right-7 space-y-4 flex flex-col items-end pointer-events-auto">
        {/* Lock button */}
        <Button onClick={() => setIsPuzzleOpen(true)} variant="outline" size="icon">
          <Lock className="h-[1.2rem] w-[1.2rem]" />
        </Button>

        {/* Coffee button */}
        <DrinkChallengeModalComponent></DrinkChallengeModalComponent>

        {/* Trophy button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Trophy className="h-[1.2rem] w-[1.2rem]" />
            </Button>
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
    </div>
  )
}
