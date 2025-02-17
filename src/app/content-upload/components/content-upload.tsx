"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Switch } from "@/components/switch"
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  ImageIcon,
  Link,
} from "lucide-react"

export default function ContentUpload() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isOriginalWork, setIsOriginalWork] = useState(false)
  const [referenceLink, setReferenceLink] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-6">
      <h1 className="text-2xl font-semibold mb-8">Post</h1>

      {/* Cover Image Section */}
      <div className="mb-6">
        <Label>Cover</Label>
        <div className="mt-2 relative">
          {coverImage ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image src={coverImage || "/placeholder.svg"} alt="Cover" layout="fill" objectFit="cover" className="w-full h-full" />
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4"
                onClick={() => setCoverImage(null)}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="relative">
              <input type="file" accept="image/*" className="hidden" id="cover-upload" onChange={handleCoverUpload} />
              <label
                htmlFor="cover-upload"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors cursor-pointer w-fit"
              >
                <ImageIcon className="w-4 h-4" />
                Add Cover
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-6">
        <Label>Title</Label>
        <div className="relative mt-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="Please enter title (required)"
            className="bg-[#2A2A2A] border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{title.length}/200</span>
        </div>
      </div>

      {/* Content Editor */}
      <div className="mb-6">
        <Label>Content</Label>
        <div className="mt-2 rounded-lg overflow-hidden border border-[#3A3A3A]">
          <div className="bg-[#2A2A2A] p-2 flex gap-2 border-b border-[#3A3A3A]">
            {[Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link].map(
              (Icon, index) => (
                <button key={index} className="p-1.5 rounded hover:bg-[#3A3A3A] transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ),
            )}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Please enter text"
            className="w-full h-64 p-4 bg-[#2A2A2A] resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Collection Selector */}
      <div className="mb-6">
        <Label>Select Collection</Label>
        <Select>
          <SelectTrigger className="mt-2 bg-[#2A2A2A] border-0">
            <SelectValue placeholder="Select Collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="collection1">Collection 1</SelectItem>
            <SelectItem value="collection2">Collection 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interest Group Selector */}
      <div className="mb-6">
        <Label>Select Interest Group</Label>
        <Select>
          <SelectTrigger className="mt-2 bg-[#2A2A2A] border-0">
            <SelectValue placeholder="Select Interest Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="group1">Group 1</SelectItem>
            <SelectItem value="group2">Group 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Copyright Settings */}
      <div className="mb-6">
        <Label>Copyright Settings</Label>
        <div className="mt-2 flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
          <span>This is my original work</span>
          <Switch checked={isOriginalWork} onCheckedChange={setIsOriginalWork} />
        </div>
        {!isOriginalWork && (
          <div className="mt-2 relative">
            <Input
              value={referenceLink}
              onChange={(e) => setReferenceLink(e.target.value)}
              placeholder="Click to paste the reference link"
              className="bg-[#2A2A2A] border-0 pr-10"
            />
            <Link className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      {/* Community Guidelines */}
      <div className="text-sm text-gray-400">
        Check the{" "}
        <a href="#" className="text-blue-400 hover:underline">
        &quot;Community Guidelines&quot;
        </a>{" "}
        before posting to maintain community order together.
      </div>
    </div>
  )
}

