"use client"; // Ensures this is a client component

import { useState, useEffect } from "react";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { Card } from "@/components/ui/card";
import { TopNav } from "@/components/top-nav";
import { FiShare2, FiFlag, FiHeart, FiMessageCircle } from "react-icons/fi"; // Importing icons

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://x8ki-letl-twmt.n7.xano.io/api:0Q68j1tU/posts")
      .then((res) => res.json())
      .then((data) =>
        setPosts(data.map((post) => ({ ...post, liked: false, likeCount: post.likes || 0 })))
      )
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  // Handle Like Button Click
  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
          : post
      )
    );
  };

  // Handle Comment Button Click (Opens alert for now, can be modified for UI input)
  const handleCommentClick = () => {
    alert("Open comment section here");
  };

  // Open Profile Pic in Full View
  const openProfilePic = (profilePic) => {
    window.open(profilePic, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <TopNav />

      {/* ✅ Main Layout */}
      <div className="flex gap-6 pt-16">
        {/* Left Sidebar */}
        <div className="w-1/4 hidden lg:block">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="bg-[#2e2e2e] border-0 p-4 relative">
              {/* 🚨 Report Button (Now on Top Right) */}
              <button className="absolute top-4 right-4 bg-black/30 p-2 rounded-full text-white hover:text-red-500">
                <FiFlag size={20} />
              </button>

              {/* User Info (Profile Picture Clickable) */}
              <div className="flex items-center gap-4">
                <img
                  src={post.user?.profile_pic || "/default-avatar.png"} // Fallback image
                  alt="User"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => openProfilePic(post.user?.profile_pic || "/default-avatar.png")}
                />
                <div>
                  <p className="text-white font-semibold">{post.user?.username || "Unknown User"}</p>
                  <p className="text-gray-400 text-sm">{post.time_ago || "Just now"}</p>
                </div>
              </div>

              {/* Post Image */}
              <div className="mt-4">
                <img
                  src={post.image || "/placeholder.jpg"} // Fallback image
                  alt="Post"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>

              {/* Post Actions (Like, Comment, Share, Views) */}
              <div className="flex items-center gap-6 mt-4 text-gray-400">
                <button
                  className={`flex items-center gap-1 ${post.liked ? "text-red-500" : "text-gray-400"}`}
                  onClick={() => toggleLike(post.id)}
                >
                  <FiHeart className="cursor-pointer hover:text-red-500" />
                  <span>{post.likeCount}</span>
                </button>

                <button className="flex items-center gap-1" onClick={handleCommentClick}>
                  <FiMessageCircle className="cursor-pointer hover:text-blue-400" />
                  <span>{post.comments || 0}</span>
                </button>

                <FiShare2 className="cursor-pointer hover:text-blue-400" /> {/* Share button */}
                <p className="text-sm">{post.views || 0} Views</p> {/* Views right of Share */}
              </div>
            </Card>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="w-1/4 hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
