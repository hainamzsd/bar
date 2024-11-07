"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

const MP3Player = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioData, setAudioData] = useState<number[]>(Array(30).fill(100))

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const animationIdRef = useRef<number | null>(null)

  const setupAudio = () => {
    if (audioContextRef.current) return

    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
    const audio = audioElementRef.current!

    sourceRef.current = audioContextRef.current.createMediaElementSource(audio)
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 64

    sourceRef.current.connect(analyserRef.current)
    analyserRef.current.connect(audioContextRef.current.destination)

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

    const updateAudioData = () => {
      analyserRef.current!.getByteFrequencyData(dataArray)
      const normalizedData = Array.from(dataArray)
        .slice(0, 30)
        .map((val) => (val / 255) * 100 + 10)
      setAudioData(normalizedData)
      animationIdRef.current = requestAnimationFrame(updateAudioData)
    }

    animationIdRef.current = requestAnimationFrame(updateAudioData)
  }

  useEffect(() => {
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
      if (audioContextRef.current) {
        if (sourceRef.current) sourceRef.current.disconnect()
        audioContextRef.current.close()
      }
    }
  }, [])

  const togglePlayPause = () => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause()
        console.log("Pausing audio")
      } else {
        audioElementRef.current.play().then(() => {
          console.log("Audio playing")
          setupAudio()
        }).catch(error => {
          console.error("Error playing audio:", error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = newVolume[0]
      setVolume(newVolume[0])
    }
  }

  const handleTimeUpdate = () => {
    if (audioElementRef.current) {
      setCurrentTime(audioElementRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioElementRef.current) {
      setDuration(audioElementRef.current.duration)
      console.log("Audio duration:", audioElementRef.current.duration)
    }
  }

  const handleProgressChange = (newTime: number[]) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = newTime[0]
      setCurrentTime(newTime[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <div className="flex flex-col items-center space-y-4">
        <audio
          ref={audioElementRef}
          src="/mgs.mp3"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={(e) => console.error("Audio error:", e)}
        />
        <div className="flex items-end h-20 w-full justify-center">
          {audioData.map((height, index) => (
            <motion.div
              key={index}
              className="bg-primary w-1 mx-px rounded-t-sm"
              animate={{
                height: `${height}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2 w-full">
          <Button onClick={togglePlayPause} size="icon" variant="ghost">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleProgressChange}
            className="w-full"
          />
          <span className="text-sm text-muted-foreground w-20 text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="flex items-center space-x-2 w-full">
          {volume === 0 ? (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          )}
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </div>
    </DialogContent>
  )
}

export default MP3Player