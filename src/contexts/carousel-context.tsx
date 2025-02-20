"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface CarouselContextType {
  activeImage: string
  activeIndex: number
  setActiveIndex: (index: number) => void
  carouselImages: string[]
  logoImage: string
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined)

export function CarouselProvider({ children }: { children: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [carouselImages] = useState<string[]>([
    "/placeholder.svg?height=200&width=150",
    "/placeholder.svg?height=200&width=150",
    "/placeholder.svg?height=200&width=150",
    "/placeholder.svg?height=200&width=150",
  ])
  const [logoImage] = useState("/placeholder.svg?height=32&width=96")

  const updateActiveIndex = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <CarouselContext.Provider
      value={{
        activeImage: carouselImages[activeIndex],
        activeIndex,
        setActiveIndex: updateActiveIndex,
        carouselImages,
        logoImage,
      }}
    >
      {children}
    </CarouselContext.Provider>
  )
}

export function useCarousel() {
  const context = useContext(CarouselContext)
  if (context === undefined) {
    throw new Error("useCarousel must be used within a CarouselProvider")
  }
  return context
} 

