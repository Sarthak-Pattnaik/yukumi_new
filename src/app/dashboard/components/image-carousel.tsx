"use client"

import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { cn } from "../../../lib/utils"
import { useCarousel } from "../contexts/carousel-context"
import type React from "react"

export function ImageCarousel() {
  const { carouselImages, activeIndex, setActiveIndex } = useCarousel()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current!.offsetLeft)
    setScrollLeft(scrollRef.current!.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current!.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current!.scrollLeft = scrollLeft - walk
  }

  const handleImageClick = (index: number) => {
    setActiveIndex(index)
  }

  useEffect(() => {
    const handleMouseUpEvent = () => {
      setIsDragging(false)
    }
    document.addEventListener("mouseup", handleMouseUpEvent)
    return () => document.removeEventListener("mouseup", handleMouseUpEvent)
  }, [])

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex justify-center gap-2 mb-4">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === activeIndex ? "bg-white" : "bg-gray-600 hover:bg-gray-400",
            )}
          />
        ))}
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative flex-shrink-0 transition-all duration-300",
              index === activeIndex ? "w-[160px] h-[213px]" : "w-[150px] h-[200px]",
              "hover:opacity-90 hover:scale-105",
            )}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Anime ${index + 1}`}
              fill
              className={cn(
                "rounded-lg object-cover transition-all duration-300",
                index === activeIndex ? "border-4 border-white" : "",
              )}
              onClick={() => handleImageClick(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

