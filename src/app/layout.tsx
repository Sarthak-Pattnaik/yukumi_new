import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Yukumi",
  description: "Anime Community Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"> 
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <main>{children}</main>
      </body> 
    </html>
  )
}

