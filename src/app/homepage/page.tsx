import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { Card } from "@/components/ui/card"
import { TopNav } from "@/components/top-nav"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <TopNav />

  {/* ✅ Main Layout */}
  <div className="flex gap-6">
    {/* Left Sidebar */}
    <div className="w-1/4 hidden lg:block">
      <LeftSidebar />
    </div>

    {/* Main Content */}
    <div className="w-full lg:w-1/2 space-y-6">
      <Card className="bg-[#2e2e2e] border-0 p-4">
        {/* Post content placeholder */}
        <div className="h-96 bg-gray-700/20 rounded-lg animate-pulse" />
      </Card>

      <Card className="bg-[#2e2e2e] border-0 p-4">
        {/* Post content placeholder */}
        <div className="h-96 bg-gray-700/20 rounded-lg animate-pulse" />
      </Card>
    </div>

    {/* Right Sidebar */}
    <div className="w-1/4 hidden lg:block">
      <RightSidebar />
    </div>
  </div>
</div>


  )
}

