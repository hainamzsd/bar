'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, Sparkles, TrendingUp, Users } from 'lucide-react'
import { PostCard } from './post-related/post-card'
import { useGetAllPosts } from '@/lib/react-query/postQueriesAndMutations'
import PostSkeleton from './skeleton/post-skeleton'
import { PostFromAPI } from '@/types/post'

const ExplorePage = () => {
  const { data: posts, isPending, isError } = useGetAllPosts();

  return (
    <div className="mx-auto space-y-8">
    <section className="bg-accent rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4 text-accent-foreground">Anime News & Announcements</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "New 'Attack on Titan' Final Season Part 3 Trailer", image: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_11_14_638356007024019763_anime-ai-la-gi-bat-mi-cach-tao-anime-bang-ai-cuc-don-gian.png" },
              { title: "Exclusive: 'My Hero Academia' Movie Announcement", image: "https://static.vecteezy.com/system/resources/previews/022/385/025/non_2x/a-cute-surprised-black-haired-anime-girl-under-the-blooming-sakura-ai-generated-photo.jpg" },
              { title: "Crunchyroll Anime Awards 2024: Nominees Revealed", image: "https://i.pinimg.com/474x/1d/b5/4e/1db54e832b76e7ab8964e31a25523885.jpg" },
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-card-foreground">{item.title}</h3>
                  <Button variant="secondary" size="sm" className="text-secondary-foreground">
                    Read More <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Explore Anime Posts</h2>
        <div className="grid gap-6">
          {/* PostCard components are commented out as requested */}
          {isPending?
          <>
           {[...Array(5)].map((_, index) => (
          <PostSkeleton key={index} />
        ))}</>
          :
          <>
           {posts?.map((post) => (
            <PostCard key={post.id}
            post={post as PostFromAPI}
            />
          ))}</>
          }
          <div className="bg-card rounded-lg shadow-md p-4 text-center">
            <p className="text-muted-foreground">Post cards are currently hidden.</p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="sticky top-[80px] space-y-6">
          <div className="bg-card rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Trending Anime</h3>
            <ul className="space-y-2">
              {['Attack on Titan', 'My Hero Academia', 'Demon Slayer', 'One Piece', 'Jujutsu Kaisen'].map((anime) => (
                <li key={anime} className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                  <span>{anime}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Suggested Users</h3>
            <ul className="space-y-2">
              {['AnimeGirl92', 'MangaMaster', 'OtakuKing', 'SailorMoon', 'NarutoFan'].map((user) => (
                <li key={user} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary mr-2" />
                    <span>{user}</span>
                  </div>
                  <Button variant="outline" size="sm">Follow</Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Discover Communities</h3>
            <Input placeholder="Search communities" className="mb-2" />
            <ScrollArea className="h-[200px]">
              <ul className="space-y-2">
                {['Anime Fanart', 'Manga Recommendations', 'Cosplay Central', 'Anime Music Lovers', 'Mecha Enthusiasts', 'Slice of Life Club', 'Shonen Jump Fans'].map((community) => (
                  <li key={community} className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    <span>{community}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ExplorePage