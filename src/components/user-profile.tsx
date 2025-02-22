"use client"
import Image from "next/image"
import { Camera } from "lucide-react"
import { useState, useRef } from "react"
import type React from "react" // Added import for React

export function UserProfile() {
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=120&width=120")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
    }
  }

  return (
    <div className="flex items-start gap-6 p-6 bg-background/50 rounded-lg">
      <div className="relative group">
        <Image
          src={avatarUrl || "/placeholder.svg"}
          alt="User Avatar"
          width={120}
          height={120}
          className="rounded-full"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="w-6 h-6" />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">DemoUser</h2>
            <div className="flex gap-8 mt-2">
              <div>
                <span className="text-white/70">Score: </span>
                <span className="font-semibold">796,432</span>
              </div>
              <div>
                <span className="text-white/70">Followers: </span>
                <span className="font-semibold">32</span>
              </div>
              <div>
                <span className="text-white/70">Following: </span>
                <span className="font-semibold">28</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/80 mb-4">Hey there! I am a demo user.</p>

        <div className="bg-white/5 p-3 rounded">
          <h3 className="text-sm text-white/60 mb-2">Following:</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <a key={i} href={`/user/${i + 1}`} className="block transition-transform hover:scale-105">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt={`Following ${i + 1}`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

