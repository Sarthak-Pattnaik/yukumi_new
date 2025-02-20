"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Layout } from "@/components/layout"
import { ImageCarousel } from "@/components/image-carousel"
import { CarouselProvider, useCarousel } from "@/contexts/carousel-context"
import Link from "next/link"

function MainContent() {
  const { activeImage } = useCarousel()
  const mainRef = useRef<HTMLDivElement>(null) 
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartY(e.pageY - mainRef.current!.offsetTop)
    setScrollTop(mainRef.current!.scrollTop)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const y = e.pageY - mainRef.current!.offsetTop
    const walk = (y - startY) * 2
    mainRef.current!.scrollTop = scrollTop - walk
  }

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${encodeURI(activeImage)})`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 flex flex-col h-[calc(100vh-80px)]">
        <div className="mt-auto flex flex-col items-center">
          <Link
            href="/join"
            className="inline-block px-8 py-3 mb-6 bg-[#FF00FF] bg-opacity-50 backdrop-blur-md text-white rounded-full text-xl font-bold 
                     transition-all hover:bg-opacity-75 hover:scale-105 animate-pulse"
          >
            JOIN NOW
          </Link>
          <div className="w-full">
            <ImageCarousel />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <CarouselProvider>
      <Layout>
        <MainContent />
      </Layout>
    </CarouselProvider>
  )
} 

