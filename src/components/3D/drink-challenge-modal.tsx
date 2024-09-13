"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Coffee, Lock } from "lucide-react"
import { DrinkChallengeModalSkeleton } from "../skeleton/drink-challenge-modal-skeleton"
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Level = {
  id: number
  title: string
  question: string
  difficulty: "Easy" | "Medium" | "Hard"
  hints: string[]
  answer: string
}

const levels: Level[] = [
  {
    id: 1,
    title: "Mojito Madness",
    question: "What are the main ingredients in a classic Mojito?",
    difficulty: "Easy",
    hints: ["It's a Cuban highball", "It's very refreshing", "It contains a citrus fruit"],
    answer: "rum,lime,mint,sugar,soda"
  },
  // Add more levels here...
]

for (let i = 2; i <= 100; i++) {
  levels.push({
    id: i,
    title: `Drink Challenge ${i}`,
    question: `This is a placeholder question for level ${i}. What's your favorite drink?`,
    difficulty: i % 3 === 0 ? "Hard" : i % 2 === 0 ? "Medium" : "Easy",
    hints: ["This is a hint", "This is another hint"],
    answer: "placeholder"
  })
}

export function DrinkChallengeModalComponent() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedLevel, setSelectedLevel] = React.useState<Level | null>(null)
  const [userAnswer, setUserAnswer] = React.useState("")
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null)
  const [showTryAgain, setShowTryAgain] = React.useState(false)
  const [unlockedLevels, setUnlockedLevels] = React.useState<number[]>([1])

  const levelsPerPage = 20
  const totalPages = Math.ceil(levels.length / levelsPerPage)

  const handleLevelClick = (level: Level) => {
    if (unlockedLevels.includes(level.id)) {
      setSelectedLevel(level)
      setUserAnswer("")
      setIsCorrect(null)
      setShowTryAgain(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedLevel) {
      const correct = userAnswer.toLowerCase() === selectedLevel.answer.toLowerCase()
      setIsCorrect(correct)
      if (correct) {
        playCorrectSound()
        triggerConfetti()
        if (!unlockedLevels.includes(selectedLevel.id + 1)) {
          setUnlockedLevels([...unlockedLevels, selectedLevel.id + 1])
        }
      } else {
        playIncorrectSound()
        setShowTryAgain(true)
      }
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const playCorrectSound = () => {
    const audio = new Audio('/correct-sound.mp3')
    audio.play()
  }

  const playIncorrectSound = () => {
    const audio = new Audio('/incorrect-sound.mp3')
    audio.play()
  }

  const goToNextLevel = () => {
    const nextLevel = levels.find(level => level.id === selectedLevel!.id + 1)
    if (nextLevel) {
      setSelectedLevel(nextLevel)
      setUserAnswer("")
      setIsCorrect(null)
      setShowTryAgain(false)
    }
  }

  return (
    <React.Suspense fallback={<DrinkChallengeModalSkeleton />}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" className="">
            <Coffee className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Drink Challenge</DialogTitle>
          </DialogHeader>
          {selectedLevel ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedLevel.title}</h3>
              <p className="text-sm text-muted-foreground">Difficulty: {selectedLevel.difficulty}</p>
              <p>{selectedLevel.question}</p>
              <div>
                <h4 className="font-semibold">Hints:</h4>
                <ul className="list-disc pl-5">
                  {selectedLevel.hints.map((hint, index) => (
                    <li key={index} className="text-sm">{hint}</li>
                  ))}
                </ul>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="answer">Your Answer</Label>
                  <Input
                    id="answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer"
                  />
                </div>
                <Button type="submit" className="mt-4">Submit</Button>
              </form>
              <AnimatePresence>
                {isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className={cn("text-sm", isCorrect ? "text-green-500" : "text-red-500")}>
                      {isCorrect ? "Correct!" : "Incorrect."}
                    </p>
                    {isCorrect && (
                      <Button onClick={goToNextLevel} className="mt-2">
                        Next Level
                      </Button>
                    )}
                  </motion.div>
                )}
                {showTryAgain && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUserAnswer("")
                        setIsCorrect(null)
                        setShowTryAgain(false)
                      }}
                    >
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button variant="outline" onClick={() => setSelectedLevel(null)}>Back to Levels</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2">
                {levels
                  .slice((currentPage - 1) * levelsPerPage, currentPage * levelsPerPage)
                  .map((level) => (
                    <TooltipProvider key={level.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-12 h-12 p-0",
                              !unlockedLevels.includes(level.id) && "bg-gray-200 cursor-not-allowed"
                            )}
                            onClick={() => handleLevelClick(level)}
                            disabled={!unlockedLevels.includes(level.id)}
                          >
                            {unlockedLevels.includes(level.id) ? (
                              level.id
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {unlockedLevels.includes(level.id)
                            ? `Level ${level.id}: ${level.title}`
                            : `Complete level ${level.id - 1} to unlock`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </React.Suspense>
  )
}