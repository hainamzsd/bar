'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import { Star, Calendar, Clock, Tv, Film, Users, Heart, Award, BarChart, Bookmark } from 'lucide-react'

type AnimeDetail = {
  mal_id: number
  url: string
  images: {
    jpg: {
      image_url: string,
      large_image_url:string
    }
  }
  trailer: {
    youtube_id: string
    url: string
    embed_url: string
  }
  title: string
  title_english: string
  title_japanese: string
  type: string
  source: string
  episodes: number
  status: string
  airing: boolean
  aired: {
    from: string
    to: string
    prop: {
      from: {
        day: number
        month: number
        year: number
      }
      to: {
        day: number
        month: number
        year: number
      }
    }
    string: string
  }
  duration: string
  rating: string
  score: number
  scored_by: number
  rank: number
  popularity: number
  members: number
  favorites: number
  synopsis: string
  background: string
  season: string
  year: number
  producers: Array<{ name: string; url: string }>
  licensors: Array<{ name: string; url: string }>
  studios: Array<{ name: string; url: string }>
  genres: Array<{ name: string; url: string }>
  themes: Array<{ name: string; url: string }>
  demographics: Array<{ name: string; url: string }>
}

interface AnimeDetailModalProps {
  animeId: number | null
  isOpen: boolean
  onClose: () => void
}

export function AnimeDetailModal({ animeId, isOpen, onClose }: AnimeDetailModalProps) {
  const [animeDetail, setAnimeDetail] = useState<AnimeDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      if (!animeId) return
      setIsLoading(true)
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
        if (!response.ok) throw new Error('Failed to fetch anime details')
        const data = await response.json()
        setAnimeDetail(data.data)
      } catch (error) {
        console.error('Error fetching anime details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen && animeId) {
      fetchAnimeDetail()
    }
  }, [animeId, isOpen])

  if (!animeDetail && !isLoading) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{animeDetail?.title || 'Loading...'}</DialogTitle>
          <DialogDescription>
            {animeDetail?.title_english && animeDetail.title_english !== animeDetail.title && `English: ${animeDetail.title_english}`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[80vh] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <Image
                    src={animeDetail?.images.jpg.large_image_url || '/placeholder.svg'}
                    alt={animeDetail?.title || 'Anime cover'}
                    width={300}
                    height={400}
                    className="rounded-lg object-cover w-full"
                  />
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-2" />
                      <span>Score: {animeDetail?.score}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-500 mr-2" />
                      <span>Scored by: {animeDetail?.scored_by}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-purple-500 mr-2" />
                      <span>Rank: #{animeDetail?.rank}</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="w-5 h-5 text-green-500 mr-2" />
                      <span>Popularity: #{animeDetail?.popularity}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-indigo-500 mr-2" />
                      <span>Members: {animeDetail?.members}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-red-500 mr-2" />
                      <span>Favorites: {animeDetail?.favorites}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {animeDetail?.genres.map((genre) => (
                      <Badge key={genre.name} variant="secondary">{genre.name}</Badge>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Tv className="w-5 h-5 text-cyan-500 mr-2" />
                      <span>Type: {animeDetail?.type}</span>
                    </div>
                    <div className="flex items-center">
                      <Film className="w-5 h-5 text-pink-500 mr-2" />
                      <span>Episodes: {animeDetail?.episodes}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <span>Duration: {animeDetail?.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-teal-500 mr-2" />
                      <span>Aired: {animeDetail?.aired.string}</span>
                    </div>
                    <div className="flex items-center">
                      <Bookmark className="w-5 h-5 text-lime-500 mr-2" />
                      <span>Status: {animeDetail?.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                <p>{animeDetail?.synopsis}</p>
              </div>
              {animeDetail?.background && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Background</h3>
                    <p>{animeDetail.background}</p>
                  </div>
                </>
              )}
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Studios</h3>
                  <ul>
                    {animeDetail?.studios.map((studio) => (
                      <li key={studio.name}>{studio.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Producers</h3>
                  <ul>
                    {animeDetail?.producers.map((producer) => (
                      <li key={producer.name}>{producer.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {animeDetail?.trailer.youtube_id && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Trailer</h3>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={`https://www.youtube.com/embed/${animeDetail.trailer.youtube_id}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}