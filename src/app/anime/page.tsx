"use client"

import { useState } from "react"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { TopNav } from "@/components/top-nav"

interface Anime {
  id: number
  rank: number
  title: string
  image: string
  episodes: number
  period: string
  score: number
  yourScore: number
  status: "Completed" | "Currently Watching" | "On-Hold"
  type: string
}

const animeList: Anime[] = [
  {
    id: 1,
    rank: 1,
    title: "Solo Leveling",
    image: "/placeholder.svg?height=80&width=60",
    episodes: 12,
    period: "Jan 2024 to Mar 2024",
    score: 10,
    yourScore: 10,
    status: "Completed",
    type: "TV",
  },
  {
    id: 2,
    rank: 2,
    title: "Chainsaw Man",
    image: "/placeholder.svg?height=80&width=60",
    episodes: 12,
    period: "Oct 2022 to Dec 2022",
    score: 10,
    yourScore: 10,
    status: "Currently Watching",
    type: "TV",
  },
  {
    id: 3,
    rank: 3,
    title: "Jujutsu Kaisen",
    image: "/placeholder.svg?height=80&width=60",
    episodes: 24,
    period: "Oct 2020 to Mar 2021",
    score: 10,
    yourScore: 10,
    status: "On-Hold",
    type: "TV",
  },
  // Add more anime entries to demonstrate scrolling
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 4,
    rank: i + 4,
    title: `Anime ${i + 4}`,
    image: "/placeholder.svg?height=80&width=60",
    episodes: 12,
    period: "2024",
    score: 10,
    yourScore: 10,
    status: "Completed" as const,
    type: "TV",
  })),
]

export default function Home() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]))
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <TopNav />
      {/* Hero Section */}
      <div className="text-center space-y-8 relative py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white">FIND THE BEST ANIME FOR YOU</h1>
        <Button className="bg-[#B624FF] hover:bg-[#B624FF]/80 text-white px-8 py-6 text-xl h-auto">TRY NOW</Button>
      </div>

      {/* Anime List */}
      <div className="anime-list-container overflow-auto rounded-lg border border-white/10 bg-card">
        <table className="w-full anime-table">
          <thead>
            <tr className="bg-black/20">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Anime Title</th>
              <th className="p-4 text-center">Score</th>
              <th className="p-4 text-center">Your Score</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {animeList.map((anime) => (
              <tr key={anime.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-4">{anime.rank}</td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      width={60}
                      height={80}
                      className="rounded"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{anime.title}</span>
                        <button onClick={() => toggleFavorite(anime.id)} className="text-red-500 hover:text-red-400">
                          <Heart className={`w-4 h-4 ${favorites.includes(anime.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div className="text-sm text-gray-400">
                        {anime.type} ({anime.episodes} eps)
                      </div>
                      <div className="text-sm text-gray-400">{anime.period}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span>{anime.score}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span>{anime.yourScore}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        anime.status === "Completed"
                          ? "bg-orange-500"
                          : anime.status === "Currently Watching"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                      }`}
                    >
                      {anime.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

