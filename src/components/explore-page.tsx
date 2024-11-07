'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, Users, BookOpen, Tv, Loader2 } from 'lucide-react'
import { PostCard } from './post-related/post-card'
import { useGetAllPosts } from '@/lib/react-query/postQueriesAndMutations'
import PostSkeleton from './skeleton/post-skeleton'
import RandomAnimeImage from './random-anime-image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import InfiniteScrollPosts from './post-related/InfiniteScroll'
import Marquee from './ui/marquee'

interface Recommendation {
  mal_id: string;
  entry: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url?: string;
      };
    };
    title: string;
  }[];
}

const ExplorePage = () => {
  const { data: posts, isPending: isPostsPending, isError: isPostsError } = useGetAllPosts();
  const [animeRecommendations, setAnimeRecommendations] = useState<Recommendation[]>([]);
  const [mangaRecommendations, setMangaRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animePage, setAnimePage] = useState(1);
  const [mangaPage, setMangaPage] = useState(1);
  const [hasMoreAnime, setHasMoreAnime] = useState(true);
  const [hasMoreManga, setHasMoreManga] = useState(true);

  const animeObserver = useRef<IntersectionObserver | null>(null);
  const mangaObserver = useRef<IntersectionObserver | null>(null);
  const animeLastElementRef = useCallback((node: HTMLLIElement | null) => {
    if (isLoading) return;
    if (animeObserver.current) animeObserver.current.disconnect();
    animeObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreAnime) {
        setAnimePage(prevPage => prevPage + 1);
      }
    });
    if (node) animeObserver.current.observe(node);
  }, [isLoading, hasMoreAnime]);

  const mangaLastElementRef = useCallback((node: HTMLLIElement | null) => {
    if (isLoading) return;
    if (mangaObserver.current) mangaObserver.current.disconnect();
    mangaObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreManga) {
        setMangaPage(prevPage => prevPage + 1);
      }
    });
    if (node) mangaObserver.current.observe(node);
  }, [isLoading, hasMoreManga]);

  const fetchRecommendations = async (type: 'anime' | 'manga', page: number) => {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/recommendations/${type}?page=${page}`);
      if (!res.ok) throw new Error(`Không thể tải khuyến nghị ${type}`);
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error(`Lỗi khi tải khuyến nghị ${type}:`, err);
      setError(`Không thể tải khuyến nghị ${type}. Vui lòng thử lại sau.`);
      return [];
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const animeData = await fetchRecommendations('anime', 1);
      const mangaData = await fetchRecommendations('manga', 1);
      setAnimeRecommendations(animeData);
      setMangaRecommendations(mangaData);
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (animePage > 1) {
      fetchRecommendations('anime', animePage).then(newData => {
        if (newData.length === 0) {
          setHasMoreAnime(false);
        } else {
          setAnimeRecommendations(prev => [...prev, ...newData]);
        }
      });
    }
  }, [animePage]);

  useEffect(() => {
    if (mangaPage > 1) {
      fetchRecommendations('manga', mangaPage).then(newData => {
        if (newData.length === 0) {
          setHasMoreManga(false);
        } else {
          setMangaRecommendations(prev => [...prev, ...newData]);
        }
      });
    }
  }, [mangaPage]);

  return (
    <div className="mx-auto space-y-8 p-4">
      <RandomAnimeImage />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Khám Phá Bài Viết Anime</h2>
          <InfiniteScrollPosts />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-[80px] space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tv className="w-5 h-5 mr-2" />
                  Anime Thịnh Hành
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-[400px] overflow-hidden rounded-lg">
                  <Marquee pauseOnHover vertical className="[--duration:100s]">
                    {animeRecommendations.map((rec, index) => (
                      <div key={`${rec.mal_id}-${index}`} className="p-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={rec.entry[0].images.jpg.image_url} alt={rec.entry[0].title} />
                            <AvatarFallback>{rec.entry[0].title.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{rec.entry[0].title}</p>
                            <p className="text-xs text-muted-foreground">Anime</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Marquee>
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white dark:from-background"></div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white dark:from-background"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Manga Phổ Biến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative flex h-[400px] w-full overflow-hidden rounded-lg [perspective:300px]">
                  <Marquee
                    vertical
                    className="h-full justify-center overflow-hidden [--duration:200s] [--gap:1rem]"
                    style={{
                      transform: 'translateX(0px) translateY(0px) translateZ(-50px) rotateX(0deg) rotateY(-20deg) rotateZ(10deg) scale(1.5)',
                    }}
                  >
                    {mangaRecommendations.map((rec, index) => (
                      <div key={`${rec.mal_id}-${index}`} className="p-2">
                        <img
                          src={rec.entry[0].images.jpg.image_url}
                          alt={rec.entry[0].title}
                          className="h-40 w-28 rounded-lg object-cover shadow-md"
                        />
                      </div>
                    ))}
                  </Marquee>
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-background"></div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-background"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Khám Phá Cộng Đồng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input placeholder="Tìm kiếm cộng đồng" className="mb-2" />
                <ScrollArea className="h-[200px]">
                  <ul className="space-y-2">
                    {['Fanart Anime', 'Đề Xuất Manga', 'Trung Tâm Cosplay', 'Yêu Thích Nhạc Anime', 'Người Hâm Mộ Mecha', 'Câu Lạc Bộ Slice of Life', 'Fan Shonen Jump'].map((community) => (
                      <li key={community} className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm">{community}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage