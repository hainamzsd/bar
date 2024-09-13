'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Coffee } from "lucide-react"

export function DrinkChallengeModalSkeleton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="">
          <Coffee className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="h-6 w-32" />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-16 w-full" />
          <div>
            <Skeleton className="h-5 w-20 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 20 }).map((_, index) => (
              <Skeleton key={index} className="w-12 h-12" />
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Skeleton className="w-10 h-10" />
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-10 h-10" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}