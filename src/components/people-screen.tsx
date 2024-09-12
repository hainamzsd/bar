"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Filter, Users } from 'lucide-react'

type Person = {
  id: number
  name: string
  avatar: string
  role: 'customer' | 'staff'
  title: string
}

const people: Person[] = [
  { id: 1, name: "Naruto Uzumaki", avatar: "https://i.pravatar.cc/150?img=32", role: "customer", title: "Ramen Enthusiast" },
  { id: 2, name: "Sakura Haruno", avatar: "https://i.pravatar.cc/150?img=44", role: "staff", title: "Barista" },
  { id: 3, name: "Sasuke Uchiha", avatar: "https://i.pravatar.cc/150?img=59", role: "customer", title: "Coffee Connoisseur" },
  { id: 4, name: "Hinata Hyuga", avatar: "https://i.pravatar.cc/150?img=47", role: "staff", title: "Pastry Chef" },
  { id: 5, name: "Kakashi Hatake", avatar: "https://i.pravatar.cc/150?img=15", role: "customer", title: "Mystery Novel Reader" },
  { id: 6, name: "Ino Yamanaka", avatar: "https://i.pravatar.cc/150?img=46", role: "staff", title: "Flower Arranger" },
  { id: 7, name: "Shikamaru Nara", avatar: "https://i.pravatar.cc/150?img=12", role: "customer", title: "Chess Master" },
  { id: 8, name: "Temari", avatar: "https://i.pravatar.cc/150?img=41", role: "staff", title: "Wind Chime Curator" },
]

export function PeopleScreenComponent() {
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'customer' | 'staff'>('all')
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setFilteredPeople(
      filter === 'all' ? people : people.filter(person => person.role === filter)
    )
  }, [filter])

  const PersonCard = ({ person }: { person: Person }) => (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={person.avatar} alt={person.name} />
              <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{person.name}</p>
              <p className="text-sm text-muted-foreground truncate">{person.title}</p>
            </div>
            <Button variant="outline" size="sm">
              {person.role === 'customer' ? 'Follow' : 'Chat'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
          <Skeleton className="h-9 w-[60px]" />
        </div>
      </CardContent>
    </Card>
  )

  const renderPeopleSection = (role: 'customer' | 'staff') => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {isLoading
          ? Array(role === 'customer' ? 6 : 3).fill(0).map((_, index) => <SkeletonCard key={`skeleton-${role}-${index}`} />)
          : filteredPeople
              .filter(person => person.role === role)
              .map(person => <PersonCard key={person.id} person={person} />)
        }
      </AnimatePresence>
    </div>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">People</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter('all')}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('customer')}>Customers</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('staff')}>Staff</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Khách hàng (Customers)</h2>
          {renderPeopleSection('customer')}
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Phục vụ (Staff)</h2>
          {renderPeopleSection('staff')}
        </div>
      </div>

      {!isLoading && filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">No people found</h2>
          <p className="mt-2 text-muted-foreground">Try changing your filter settings.</p>
        </div>
      )}
    </div>
  )
}