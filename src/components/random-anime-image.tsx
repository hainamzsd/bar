'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCcw, ExternalLink, X, ZoomIn, ZoomOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

interface ImageInfo {
  id: string
  source: string
  tags: string[]
  dataUrl: string
}

export default function RandomAnimeImage() {
  const [images, setImages] = useState<ImageInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const fetchRandomImages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/random-anime', {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Không thể tải hình ảnh')
      }

      const data = await response.json()
      console.log(data)
      setImages(data)
    } catch (err) {
      setError('Không thể tải hình ảnh. Vui lòng thử lại.')
      console.error('Lỗi khi tải hình ảnh:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRandomImages()
  }, [])

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Trưng Bày Anime</h2>
          <Button onClick={fetchRandomImages} disabled={isLoading}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Hình Ảnh Mới
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="w-full h-48 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(image)}
                className="cursor-pointer"
              >
                <img
                  src={image.dataUrl}
                  alt={`Hình ảnh anime ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <a href={image.source} target="_blank" rel="noopener noreferrer">
                      Xem Nguồn
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
      <AnimatePresence>
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => {
            setSelectedImage(null)
            setIsZoomed(false)
          }}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Chi Tiết Hình Ảnh</DialogTitle>
                <DialogDescription>
                  <div className="relative">
                    <img
                      src={selectedImage.dataUrl}
                      alt="Hình ảnh anime được chọn"
                      className={`w-full h-auto rounded-lg mb-4 transition-all duration-300`}
                    />
                  </div>
                  <p><strong>ID Hình Ảnh:</strong> {selectedImage.id}</p>
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <a href={selectedImage.source} target="_blank" rel="noopener noreferrer">
                      Xem Nguồn
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Card>
  )
}