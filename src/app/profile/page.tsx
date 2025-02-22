import { TopNav } from "@/components/top-nav"
import { UserProfile } from "@/components/user-profile"
import { ContentSections } from "@/components/content-sections"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <TopNav />

      <main className="container mx-auto px-4 py-8">
        <UserProfile />

        <div className="mt-8">
          <ContentSections />
        </div>
      </main>
    </div>
  )
}

