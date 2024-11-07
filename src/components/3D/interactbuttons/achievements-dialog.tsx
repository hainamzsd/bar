"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trophy, Lock } from "lucide-react"

interface Achievement {
  name: string;
  unlocked: boolean;
}

interface AchievementsDialogProps {
  achievements: Achievement[];
  triggerRef: React.RefObject<HTMLDivElement>;
}

export function AchievementsDialog({ achievements, triggerRef }: AchievementsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={triggerRef} className="hidden">Achievements Trigger</div>
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
  )
}