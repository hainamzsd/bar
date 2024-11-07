"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'

const puzzleHints = [
  "The first letter is the same as the last letter of 'espresso'.",
  "It rhymes with 'team'.",
  "It's a coffee lover's ____. ",
]

interface PuzzleDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onPuzzleSolved: () => void;
}

export function PuzzleDialog({ isOpen, setIsOpen, onPuzzleSolved }: PuzzleDialogProps) {
  const [puzzleInput, setPuzzleInput] = useState("")
  const [currentHint, setCurrentHint] = useState(0)
  const { toast } = useToast()

  const handlePuzzleSubmit = () => {
    if (puzzleInput.toLowerCase() === "dream") {
      onPuzzleSolved()
      toast({
        title: "Congratulations! You've solved the puzzle!",
      })
      setIsOpen(false)
    } else {
      toast({
        title: "That's not quite right. Try again!",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  )
}