"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bookmark, Heart, MessageCircle, Share2, X } from 'lucide-react'

const savedPosts = [
  {
    id: 1,
    user: { name: 'Naruto Uzumaki', avatar: 'https://i.pravatar.cc/150?img=32' },
    content: 'Just mastered a new jutsu! Can\'t wait to show it off in the next mission. #Rasengan',
    image: 'https://picsum.photos/seed/post1/600/400',
    likes: 1234,
    comments: 89,
    shares: 56,
  },
  {
    id: 2,
    user: { name: 'Monkey D. Luffy', avatar: 'https://i.pravatar.cc/150?img=33' },
    content: 'Found a new island! The adventure never stops. Who wants to join my crew? #PirateKing',
    image: 'https://picsum.photos/seed/post2/600/400',
    likes: 5678,
    comments: 234,
    shares: 123,
  },
  {
    id: 3,
    user: { name: 'Goku', avatar: 'https://i.pravatar.cc/150?img=34' },
    content: 'Training in 1000x gravity today. Feeling stronger already! #SuperSaiyan',
    image: 'https://picsum.photos/seed/post3/600/400',
    likes: 9876,
    comments: 543,
    shares: 321,
  },
  {
    id: 4,
    user: { name: 'Sailor Moon', avatar: 'https://i.pravatar.cc/150?img=35' },
    content: 'In the name of the moon, I\'ll punish you! New transformation sequence coming soon. #MoonPrism',
    image: 'https://picsum.photos/seed/post4/600/400',
    likes: 4321,
    comments: 176,
    shares: 98,
  },
  {
    id: 5,
    user: { name: 'Light Yagami', avatar: 'https://i.pravatar.cc/150?img=36' },
    content: 'Just another day of making the world a better place. Nothing suspicious here. #Kira',
    image: 'https://picsum.photos/seed/post5/600/400',
    likes: 6789,
    comments: 321,
    shares: 187,
  },
  {
    id: 6,
    user: { name: 'Mikasa Ackerman', avatar: 'https://i.pravatar.cc/150?img=37' },
    content: 'Titan-slaying workout complete. Ready for whatever comes next. #AttackOnTitan',
    image: 'https://picsum.photos/seed/post6/600/400',
    likes: 8765,
    comments: 432,
    shares: 210,
  },
]

export function SavedPostsScreen() {
  const [selectedPost, setSelectedPost] = useState(null)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Saved Posts</h1>
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {savedPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <img src={post.image} alt="Post" className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={post.user.avatar} alt={post.user.name} />
                          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{post.user.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">{post.comments}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Share2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm">{post.shares}</span>
                    </div>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {post.user.name}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh]">
                  <img src={post.image} alt="Post" className="w-full h-64 object-cover rounded-md mb-4" />
                  <p className="mb-4">{post.content}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>{post.likes} likes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <span>{post.comments} comments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Share2 className="h-5 w-5 text-green-500" />
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Comments</h3>
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://i.pravatar.cc/150?img=${38 + index}`} />
                          <AvatarFallback>U{index + 1}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">User {index + 1}</p>
                          <p className="text-sm text-muted-foreground">Great post! Keep up the awesome work!</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}