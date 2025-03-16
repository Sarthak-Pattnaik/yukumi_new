import { ContentFeed } from "@/components/content-feed"
import { CommunitiesSidebar } from "@/components/communities-sidebar"
import { CommunityNavbar } from "@/components/communities-navbar"
import { RecentPosts } from "@/components/recent-posts"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
    <div className="h-screen flex flex-col bg-[#121212]">
      <CommunityNavbar />
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
    <Footer />
    </>
  )
}

