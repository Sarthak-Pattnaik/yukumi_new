"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { ImageCarousel } from "@/components/image-carousel"
import { CarouselProvider, useCarousel } from "@/contexts/carousel-context"
import Link from "next/link"
import { auth } from "@/app/auth/register-form/firebase";
import { ButtonCarousel } from "@/components/button-carousel"
import Footer from "@/components/footer"

function MainContent() { 
  const carousel = useCarousel(); 
  const activeImage = carousel?.activeImage || "/placeholder.svg";
  const mainRef = useRef<HTMLDivElement>(null) 
  const [user, setUser] = useState<null | object>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);
  return (
    <main
      ref={mainRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-cover bg-top z-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${encodeURI(activeImage)})`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 flex flex-row h-[calc(100vh-80px)] justify-between items-center">
  {/* Left Side: Join Now Button */}
  <div className="flex flex-col items-center gap-0 relative">
  <div className="relative w-full flex justify-center mt-2 max-w-md h-[300px]">
      <ImageCarousel />
    </div>
    {user ? (
    <Link
      href="/community"
      className="inline-block px-8 py-3 mt-[-10px] mb-6 bg-[#FF00FF] bg-opacity-50 backdrop-blur-md text-white rounded-full text-xl font-bold 
               transition-all hover:bg-opacity-75 hover:scale-105 animate-pulse"
    >
      EXPLORE
    </Link>
    ):(
      <Link
      href="/auth/register-form"
      className="inline-block px-8 py-3 mt-[-10px] mb-6 bg-[#FF00FF] bg-opacity-50 backdrop-blur-md text-white rounded-full text-xl font-bold 
               transition-all hover:bg-opacity-75 hover:scale-105 animate-pulse"
    >
      JOIN NOW
    </Link>
    )}
    </div>
  <div className="w-full max-w-lg">
    <ButtonCarousel />
  </div>
</div>

    </main>
  )
}

export default function Home() {
  return (
    <>
    <CarouselProvider>
      <DashboardNav>
        <MainContent />
      </DashboardNav>
    </CarouselProvider>
    <Footer />
    </>
  )
} 

