"use client"

import Image from "next/image"
import Link from "next/link"
import { Bell, User, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"

export function TopNav() {
  const [logoUrl, setLogoUrl] = useState<string>(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Yukumi_1-4YZbSzz6dQIQAi6qNk70xVepJGKfmb.png",
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoUrl(url)
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-card">
      <div className="flex items-center gap-8">
        <div className="relative group">
          <Link href="/" className="flex items-center">
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt="Yukumi Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Upload className="w-5 h-5 text-white" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </div>
        <div className="flex gap-6">
          <Link href="/" className="text-white hover:text-[#B624FF] transition-colors">
            Home
          </Link>
          <Link href="/anime" className="text-white hover:text-[#B624FF] transition-colors">
            Anime
          </Link>
          <Link href="/community" className="text-white hover:text-[#B624FF] transition-colors">
            Community
          </Link>
          <Link href="/tracker" className="text-white hover:text-[#B624FF] transition-colors">
            Tracker
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:text-[#B624FF]">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:text-[#B624FF]">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  )
}

