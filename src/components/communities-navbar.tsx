"use client"

import {Search} from "lucide-react"
import * as React from "react"

import { Input } from "@/components/ui/input"
import { TopNav } from "./top-nav"

export function CommunityNavbar() {
  const [tags, setTags] = React.useState(["Solo Leveling", "Jujutsu Kaisen", "Chainsaw Man", "Konosuba"])

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="fixed top-0 z-50 w-full bg-[#121212] border-b border-zinc-800">
      <TopNav />
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

