"use client"

import type React from "react"

import { useState } from "react"
import { Upload, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/ui/sidebar"

export default function ProfileSetup() {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0c1322]">
      <Sidebar />
      <div className="flex-1">
        <div className="h-16 bg-gradient-to-r from-[#d600db] to-[#131424]" />
        <main className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-[#131424] p-6 shadow-lg">
            <div className="mb-8 flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileImage || "/placeholder.svg?height=80&width=80"} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#d600db] text-white"
                >
                  <Upload className="h-3 w-3" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <span className="text-lg font-medium text-white">UPLOAD PROFILE IMAGE</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[#86909c]">
                  Full Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Your First Name"
                  className="border-[#292d32] bg-[#131424] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[#86909c]">
                  Nick Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Your Last Name"
                  className="border-[#292d32] bg-[#131424] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-[#86909c]">
                  Gender
                </Label>
                <Select>
                  <SelectTrigger className="border-[#292d32] bg-[#131424] text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131424] text-white">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-[#86909c]">
                  Country
                </Label>
                <Select>
                  <SelectTrigger className="border-[#292d32] bg-[#131424] text-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131424] text-white">
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="text-[#86909c]">
                  Language
                </Label>
                <Select>
                  <SelectTrigger className="border-[#292d32] bg-[#131424] text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131424] text-white">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-[#86909c]">
                  Time Zone
                </Label>
                <Select>
                  <SelectTrigger className="border-[#292d32] bg-[#131424] text-white">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131424] text-white">
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                    <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                    <SelectItem value="utc+5.5">Indian Standard Time (UTC+5:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-medium text-[#86909c]">My email Address</h3>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#86909c]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="border-[#292d32] bg-[#131424] text-white"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

