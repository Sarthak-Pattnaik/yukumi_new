import { ContentFeed } from "../components/content-feed"
import { CommunitiesSidebar } from "../components/communities-sidebar"
import { Navbar } from "../components/navbar"
import { RecentPosts } from "../components/recent-posts"

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-[#121212]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {" "}
        {/* Container for all scrollable areas */}
        <CommunitiesSidebar />
        <main className="flex-1">
          <ContentFeed />
        </main>
        <RecentPosts />
      </div>
    </div>
  )
}

