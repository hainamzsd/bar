'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import { AnimeSkeleton } from '../skeleton/app-components-anime-skeleton'
import { Pagination } from '../app-components-pagination'
import { AnimeDetailModal } from './components-anime-detail-modal'
import { Button } from '../ui/button'

type Anime = {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
    }
  }
  synopsis: string
  score: number
  season: string
  year: number
}

type AnimeResponse = {
  data: Anime[]
  pagination: {
    last_visible_page: number
    has_next_page: boolean
  }
}

const fetchAnime = async (season: 'now' | 'upcoming', page: number): Promise<AnimeResponse> => {
  const res = await fetch(`https://api.jikan.moe/v4/seasons/${season}?page=${page}`)
  if (!res.ok) {
    throw new Error('Failed to fetch anime')
  }
  return res.json()
}

export function SeasonalAnimeComponent() {
  const [currentAnime, setCurrentAnime] = useState<Anime[]>([])
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [currentPagination, setCurrentPagination] = useState<AnimeResponse['pagination'] | null>(null)
  const [upcomingPagination, setUpcomingPagination] = useState<AnimeResponse['pagination'] | null>(null)
  const [activeTab, setActiveTab] = useState<'now' | 'upcoming'>('now')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAnimeClick = (animeId: number) => {
    setSelectedAnimeId(animeId)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const loadAnime = async () => {
      setIsLoading(true)
      try {
        const [currentResponse, upcomingResponse] = await Promise.all([
          fetchAnime('now', currentPage),
          fetchAnime('upcoming', upcomingPage)
        ])
        setCurrentAnime(currentResponse.data)
        setUpcomingAnime(upcomingResponse.data)
        setCurrentPagination(currentResponse.pagination)
        setUpcomingPagination(upcomingResponse.pagination)
      } catch (error) {
        console.error('Failed to fetch anime:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnime()
  }, [currentPage, upcomingPage])

  const handlePageChange = (newPage: number) => {
    if (activeTab === 'now') {
      setCurrentPage(newPage)
    } else {
      setUpcomingPage(newPage)
    }
  }

  const renderAnimeGrid = (animeList: Anime[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {animeList.map((anime) => (
        <Card key={anime.mal_id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{anime.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="relative h-48 mb-4">
              <Image
                src={anime.images.jpg.image_url}
                alt={anime.title}
                layout="fill"
                objectFit="cover"
      quality={100} // Set quality to 100 for higher resolution
                className="rounded-md"
              />
            </div>
            <p className="text-sm mb-2 flex-grow">{anime.synopsis?.slice(0, 150)}...</p>
            <div className="flex justify-between items-center">
              <span
                className={`text-sm font-semibold ${anime.score >= 8
                    ? 'text-green-500'
                    : anime.score >= 5
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}
              >
                Score: {anime.score}
              </span>
              <span className="text-sm">{anime.season} {anime.year}</span>
            </div>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => handleAnimeClick(anime.mal_id)}
            >
              Chi tiết
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <>
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'now' | 'upcoming')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="now">Mùa này</TabsTrigger>
        <TabsTrigger value="upcoming">Mùa tiếp theo</TabsTrigger>
      </TabsList>
      <TabsContent value="now">
        <h2 className="text-2xl font-bold mb-4">Anime mùa này</h2>
        {isLoading ? (
          <AnimeSkeleton />
        ) : (
          <>
            {renderAnimeGrid(currentAnime)}
            <Pagination
              currentPage={currentPage}
              hasNextPage={currentPagination?.has_next_page || false}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </TabsContent>
      <TabsContent value="upcoming">
        <h2 className="text-2xl font-bold mb-4">Anime mùa tới</h2>
        {isLoading ? (
          <AnimeSkeleton />
        ) : (
          <>
            {renderAnimeGrid(upcomingAnime)}
            <Pagination
              currentPage={upcomingPage}
              hasNextPage={upcomingPagination?.has_next_page || false}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </TabsContent>
    </Tabs>
    <AnimeDetailModal 
    animeId={selectedAnimeId} 
    isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)} 
  />
  </>
  )
}