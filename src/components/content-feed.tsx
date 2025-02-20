"use client"

import { Eye, Heart, MessageCircle, MoreHorizontal, Share2, TrendingUp } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ContentFeed() {
  // Create multiple posts for scrolling demonstration
  const posts = Array(5)
    .fill(null)
    .map((_, i) => ({
      id: i,
      username: "Username",
      timeAgo: "2 hours ago",
      likes: "2.5k",
      comments: "123",
      views: "20k",
      trending: "15k",
    }))

  return (
    <div className="h-[calc(100vh-104px)] mt-[104px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
      <div className="px-4 pb-4 max-w-3xl mx-auto">
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-700" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-zinc-100">{post.username}</p>
                    <p className="text-xs text-zinc-400">{post.timeAgo}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5 text-zinc-400" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-[16/9]">
                  <Image src="/placeholder.svg?height=450&width=800" alt="Post content" className="object-cover" fill />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 border-t border-zinc-800">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                    <Heart className="mr-2 h-4 w-4" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {post.trending}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

