"use client"

import { Bell, Search, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { Button } from "../../../components/button"
import { Input } from "../../../components/input"

export function Navbar() {
  const [tags, setTags] = React.useState(["Solo Leveling", "Jujutsu Kaisen", "Chainsaw Man", "Konosuba"])

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="fixed top-0 z-50 w-full bg-[#121212] border-b border-zinc-800">
      <div className="flex h-16 items-center px-4 gap-8">
        <Link href="/" className="flex items-center">
          <div className="relative w-[108px] h-[48px]">
            <Image
              src="/placeholder.svg?height=48&width=108"
              alt="Yukumi Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="flex gap-6">
          <Link href="/dashboard/app" className="text-white hover:text-[#B624FF] transition-colors">
            Home
          </Link>
          <Link href="/anime/app" className="text-white hover:text-[#B624FF] transition-colors">
            Anime
          </Link>
          <Link href="/community/app" className="text-white hover:text-[#B624FF] transition-colors">
            Community
          </Link>
          <Link href="/tracker/app" className="text-white hover:text-[#B624FF] transition-colors">
            Tracker
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search Communities"
            className="w-[300px] bg-zinc-900 border-zinc-700 text-white"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1">
              <span className="text-sm text-white">{tag}</span>
              <button onClick={() => removeTag(tag)} className="ml-1 rounded-full text-zinc-400 hover:text-white">
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

