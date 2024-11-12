"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Repeat, Repeat1 as RepeatOne, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"

const MP3Player = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioData, setAudioData] = useState<number[]>(Array(30).fill(100))
  const [isRepeat, setIsRepeat] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

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

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat)
    if (audioElementRef.current) {
      audioElementRef.current.loop = !isRepeat
    }
  }

  return (
    <div className={`fixed bottom-0 left-0 pointer-events-auto right-0 bg-background border-t border-border shadow-lg transition-all duration-300 ease-in-out ${isExpanded ? 'h-auto' : 'h-16 sm:h-20'}`}>
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16 sm:h-20">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden hidden sm:block">
            <img
              src="https://i.ytimg.com/vi/QZr8rhp5y7s/hqdefault.jpg"
              alt="Album cover"
              // layout="fill"
              // objectFit="cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium">Cà phê ^-^</h3>
            {/* <p className="text-xs text-muted-foreground">Artist Name</p> */}
          </div>
        </div>
        <div className="flex-1 mx-4 h-8 flex items-center justify-center ">
          <div className="w-full h-full flex items-end justify-center space-x-px">
            {audioData.map((height, index) => (
              <motion.div
                key={index}
                className="bg-primary w-1 rounded-t-sm"
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
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={togglePlayPause} size="icon" variant="ghost">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button onClick={toggleRepeat} size="icon" variant="ghost" className="hidden sm:inline-flex">
            {isRepeat ? <RepeatOne className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setIsExpanded(!isExpanded)} size="icon" variant="ghost" className="sm:hidden">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className={`space-y-4 pb-4 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
        <audio
          ref={audioElementRef}
          src="/coffee.mp3"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => !isRepeat && setIsPlaying(false)}
          onError={(e) => console.error("Audio error:", e)}
          loop={isRepeat}
        />
        {/* <div className="flex items-end h-16 w-full justify-center sm:block">
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
        </div> */}
        <div className="flex items-center space-x-2 w-full">
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
    </div>
  </div>
  )
}

export default MP3Player