'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  hasNextPage: boolean
  onPageChange: (newPage: number) => void
}

export function Pagination({ currentPage, hasNextPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Trước
      </Button>
      <span>Trang {currentPage}</span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        variant="outline"
      >
        Sau <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}