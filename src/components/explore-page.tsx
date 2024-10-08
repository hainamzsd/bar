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
          <div className="grid gap-6">
            {isPostsPending ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <PostSkeleton key={index} />
                ))}
              </>
            ) : isPostsError ? (
              <p className="text-red-500">Lỗi khi tải bài viết. Vui lòng thử lại sau.</p>
            ) : (
              <>
                {posts?.map((post) => (
                  <PostCard key={post.$id} post={post as any} />
                ))}
              </>
            )}
          </div>
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
                <ScrollArea className="h-[400px] pr-4">
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="h-16 bg-gray-200 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : error ? (
                    <p className="text-red-500 text-sm">{error}</p>
                  ) : (
                    <ul className="space-y-4">
                      {animeRecommendations.map((rec, index) => (
                        <li
                          key={`${rec.mal_id}-${index}`}
                          ref={index === animeRecommendations.length - 1 ? animeLastElementRef : null}
                          className="flex items-center space-x-3"
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={rec.entry[0].images.jpg.image_url} alt={rec.entry[0].title} />
                            <AvatarFallback>{rec.entry[0].title.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{rec.entry[0].title}</p>
                            <p className="text-xs text-muted-foreground">Anime</p>
                          </div>
                        </li>
                      ))}
                      {hasMoreAnime && (
                        <li className="flex justify-center">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </li>
                      )}
                    </ul>
                  )}
                </ScrollArea>
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
                <ScrollArea className="h-[400px] pr-4">
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="h-16 bg-gray-200 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : error ? (
                    <p className="text-red-500 text-sm">{error}</p>
                  ) : (
                    <ul className="space-y-4">
                      {mangaRecommendations.map((rec, index) => (
                        <li
                          key={`${rec.mal_id}-${index}`}
                          ref={index === mangaRecommendations.length - 1 ? mangaLastElementRef : null}
                          className="flex items-center space-x-3"
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={rec.entry[0].images.jpg.image_url} alt={rec.entry[0].title} />
                            <AvatarFallback>{rec.entry[0].title.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{rec.entry[0].title}</p>
                            <p className="text-xs text-muted-foreground">Manga</p>
                          </div>
                        </li>
                      ))}
                      {hasMoreManga && (
                        <li className="flex justify-center">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </li>
                      )}
                    </ul>
                  )}
                </ScrollArea>
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