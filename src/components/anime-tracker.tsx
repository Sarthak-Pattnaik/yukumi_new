"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import * as Tooltip from "@radix-ui/react-tooltip"

type AnimeStatus = "ALL ANIME" | "CURRENTLY WATCHING" | "COMPLETED" | "ON-HOLD" | "DROPPED" | "PLAN TO WATCH"

interface AnimeEntry {
  id: number
  title: string
  image: string
  score: number
  type: string
  progress: string
  status: Exclude<AnimeStatus, "ALL ANIME">
}

interface StatsData {
  watching: number
  completed: number
  onHold: number
  dropped: number
  planToWatch: number
}

export function AnimeTracker() {
  const [activeTab, setActiveTab] = useState<AnimeStatus>("ALL ANIME")

  const animeList: AnimeEntry[] = [
    {
      id: 1,
      title: "Chainsaw Man",
      image: "/placeholder.svg?height=60&width=40",
      score: 10,
      type: "TV",
      progress: "11/12",
      status: "CURRENTLY WATCHING",
    },
    {
      id: 2,
      title: "Solo Leveling",
      image: "/placeholder.svg?height=60&width=40",
      score: 10,
      type: "TV",
      progress: "12",
      status: "COMPLETED",
    },
    {
      id: 3,
      title: "Jujutsu Kaisen",
      image: "/placeholder.svg?height=60&width=40",
      score: 10,
      type: "TV",
      progress: "20/24",
      status: "ON-HOLD",
    },
    {
      id: 4,
      title: "Demon Slayer",
      image: "/placeholder.svg?height=60&width=40",
      score: 10,
      type: "TV",
      progress: "21/26",
      status: "DROPPED",
    },
    {
      id: 5,
      title: "Konosuba",
      image: "/placeholder.svg?height=60&width=40",
      score: 0,
      type: "TV",
      progress: "-",
      status: "PLAN TO WATCH",
    },
  ]

  const favorites = [
    { id: 1, image: "/placeholder.svg?height=80&width=60", title: "Chainsaw Man" },
    { id: 2, image: "/placeholder.svg?height=80&width=60", title: "Solo Leveling" },
    { id: 3, image: "/placeholder.svg?height=80&width=60", title: "Jujutsu Kaisen" },
    { id: 4, image: "/placeholder.svg?height=80&width=60", title: "Demon Slayer" },
  ]

  const stats: StatsData = {
    watching: 1,
    completed: 1,
    onHold: 1,
    dropped: 1,
    planToWatch: 1,
  }

  const statusColors = {
    watching: {
      color: "#074e06",
      label: "Watching",
      hover: "hover:bg-[#074e06]/80",
    },
    completed: {
      color: "#ff7f27",
      label: "Completed",
      hover: "hover:bg-[#ff7f27]/80",
    },
    onHold: {
      color: "#c3b705",
      label: "On Hold",
      hover: "hover:bg-[#c3b705]/80",
    },
    dropped: {
      color: "#ee0c0c",
      label: "Dropped",
      hover: "hover:bg-[#ee0c0c]/80",
    },
    planToWatch: {
      color: "#847f7c",
      label: "Plan to Watch",
      hover: "hover:bg-[#847f7c]/80",
    },
  }

  const total = Object.values(stats).reduce((acc, curr) => acc + curr, 0)

  const handleStatusClick = (status: keyof StatsData) => {
    const statusMap = {
      watching: "CURRENTLY WATCHING",
      completed: "COMPLETED",
      onHold: "ON-HOLD",
      dropped: "DROPPED",
      planToWatch: "PLAN TO WATCH",
    }
    setActiveTab(statusMap[status] as AnimeStatus)
  }

  const filteredAnime = activeTab === "ALL ANIME" ? animeList : animeList.filter((anime) => anime.status === activeTab)

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Profile Section */}
      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="relative w-24 h-24">
            <Image
              src="/placeholder.svg?height=96&width=96"
              alt="Profile Avatar"
              className="rounded-full"
              width={96}
              height={96}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Favourites</h2>
            <div className="grid grid-cols-4 gap-4 max-w-xl">
              {favorites.map((favorite) => (
                <Link
                  key={favorite.id}
                  href={`/anime/${favorite.id}`}
                  className="relative aspect-[3/4] rounded overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={favorite.image || "/placeholder.svg"}
                    alt={favorite.title}
                    fill
                    className="object-cover"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-400">Days:</div>
            <div className="font-bold">2.0</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Mean Score:</div>
            <div className="font-bold">10.00</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Total Entries:</div>
            <div className="font-bold">{total}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Episodes:</div>
            <div className="font-bold">64</div>
          </div>
        </div>

        {/* Interactive Stats Bar */}
        <div className="relative h-8 mb-8">
          <div className="absolute inset-0 flex rounded-md overflow-hidden">
            {(Object.keys(stats) as Array<keyof StatsData>).map((status) => {
              const count = stats[status]
              const percentage = (count / total) * 100
              const config = statusColors[status]

              return (
                <Tooltip.Provider key={status}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        className={`h-full transition-all duration-200 ${
                          activeTab === statusColors[status].label.toUpperCase() ? "opacity-80" : ""
                        } ${config.hover}`}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: config.color,
                        }}
                        onClick={() => handleStatusClick(status)}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className="bg-black/90 text-white px-3 py-2 rounded-md text-sm" sideOffset={5}>
                        <div className="font-medium">{config.label}</div>
                        <div className="text-gray-300">
                          {count} {count === 1 ? "series" : "series"}
                        </div>
                        <div className="text-gray-400">{percentage.toFixed(1)}%</div>
                        <Tooltip.Arrow className="fill-black/90" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )
            })}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["ALL ANIME", "CURRENTLY WATCHING", "COMPLETED", "ON-HOLD", "DROPPED", "PLAN TO WATCH"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as AnimeStatus)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Anime List Table */}
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAnime.map((anime) => (
                <tr key={anime.id} className="hover:bg-white/5">
                  <td className="py-3 px-4">{anime.id}</td>
                  <td className="py-3 px-4">
                    <Link href={`/anime/${anime.id}`} className="flex items-center gap-3 hover:text-blue-400">
                      <Image
                        src={anime.image || "/placeholder.svg"}
                        alt={anime.title}
                        width={40}
                        height={60}
                        className="rounded"
                      />
                      <span>{anime.title}</span>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-right">{anime.score || "-"}</td>
                  <td className="py-3 px-4">{anime.type}</td>
                  <td className="py-3 px-4 text-right">{anime.progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

