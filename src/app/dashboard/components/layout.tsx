'use client';

import Link from "next/link"
import Image from "next/image"
import type React from "react"
import { Bell, User } from "lucide-react"
import { useCarousel } from "../contexts/carousel-context"

const NAV_LINKS = [
  { href: "/home/app", label: "Home" },
  { href: "/anime/app", label: "Anime" },
  { href: "/community/app", label: "Community" },
  { href: "/tracker/app", label: "Tracker" },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { logoImage } = useCarousel()

  return (
    <div className="min-h-screen bg-[#07081F] overflow-hidden">
      <nav className="flex items-center px-8 py-4 bg-transparent absolute top-0 left-0 right-0 z-10">
        <Link href="/" className="relative w-24 h-8 mr-8">
          <Image
            src={logoImage || "/placeholder.svg"}
            alt="YUKUMI"
            width={96}
            height={32}
            className="object-contain"
            priority
          />
        </Link>
        
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white hover:text-gray-300 transition-colors text-sm relative group"
            >
              {link.label}
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-6 ml-auto">
          <Link href="/notifications" className="text-white hover:text-gray-300 transition-colors">
            <Bell className="w-5 h-5" />
          </Link>
          <Link href="/profile" className="text-white hover:text-gray-300 transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}

