"use client"

import React from 'react'
import { parseDate } from 'chrono-node'

import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

export const parseDateTime = (str: Date | string) => {
  if (str instanceof Date) return str
  return parseDate(str)
}

const formatDateOnly = (datetime: Date | string) => {
  return new Date(datetime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const inputBase =
  'bg-transparent focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50'

interface DatePickerProps {
  value?: Date
  onValueChange: (date: Date) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value, onValueChange, placeholder, disabled }, ref) => {
    const [inputValue, setInputValue] = React.useState<string>('')

    React.useEffect(() => {
      if (!value) {
        setInputValue('')
        return
      }
      const formattedValue = formatDateOnly(value)
      setInputValue(formattedValue)
    }, [value])

    const handleParse = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedDate = parseDateTime(e.currentTarget.value)
        if (parsedDate) {
          parsedDate.setHours(0, 0, 0, 0)
          onValueChange(parsedDate)
          setInputValue(formatDateOnly(parsedDate))
        }
      },
      []
    )

    const handleKeydown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleParse(e as any)
        }
      },
      [handleParse]
    )

    return (
      <div className={cn('flex items-center justify-center bg-background', className)}>
        <div
          className={cn(
            'flex gap-1 w-full p-1 items-center justify-between rounded-md border transition-all',
            'focus-within:outline-0 focus:outline-0 focus:ring-0',
            'placeholder:text-muted-foreground focus-visible:outline-0 '
          )}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                size={'icon'}
                className={cn(
                  'size-9 flex items-center justify-center font-normal',
                  !value && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="size-4" />
                <span className="sr-only">calendar</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background" sideOffset={8}>
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => date && onValueChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <input
            ref={ref}
            type="text"
            placeholder={placeholder ?? "e.g. 'tomorrow' or 'next monday'"}
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={handleKeydown}
            onBlur={handleParse}
            className={cn('px-2 mr-0.5 bg-background flex-1 border-none h-8 rounded', inputBase)}
            disabled={disabled}
          />
        </div>
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'