"use client"

import { Facebook } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { type FormEvent, useState } from "react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempted:", formData)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-green-500/20 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute bottom-40 right-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="w-full max-w-md p-8 space-y-8 relative z-10">
        <h1 className="text-4xl font-bold text-center text-white mb-12">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-900 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Login
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-white/60 text-sm">or</span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <div className="flex justify-center gap-6">
          <Link
            href="/auth/google"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4285f4] hover:opacity-90 transition-opacity"
          >
            <Image src="/placeholder.svg?height=24&width=24" alt="Google" width={24} height={24} className="w-6 h-6" />
          </Link>

          <Link
            href="/auth/facebook"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1877f2] hover:opacity-90 transition-opacity"
          >
            <Facebook className="w-6 h-6 text-white" />
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/signup"
            className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-purple-900 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

