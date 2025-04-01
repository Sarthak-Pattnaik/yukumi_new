"use client"; // Ensures this is a client component

import { useState, useEffect } from "react";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { Card } from "@/components/ui/card";
import { TopNav } from "@/components/top-nav";
import { FiShare2, FiFlag, FiHeart, FiMessageCircle } from "react-icons/fi"; // Importing icons
import { useRouter } from "next/navigation";

interface Post {
  id: number
  created_at: string
  users_id: number
  animes1_id: number
  title: string
  image_url: string
  content: string
  collection: string[]
  OG_Work: boolean
  ref_link: string
  likes: number
  comment_count: number
  views: number
  shares: number
  liked?: boolean;
  username?: string;
  profile_pic?: string;
}


export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
      fetch("https://x8ki-letl-twmt.n7.xano.io/api:0Q68j1tU/posts")
        .then((res) => res.json())
        .then(async (data) => {
          // Fetch user details for each post
          const postsWithUserData = await Promise.all(
            data.map(async (post: Post) => {
              try {
                const userRes = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users/${post.users_id}`);
                const userData = await userRes.json();
                setUserId(userData.id);
                return {
                  ...post,
                  liked: false, // Default liked state
                  username: userData.username, // Add username
                  profile_pic: userData.profile_pic // Add profile picture
                };
              } catch (error) {
                console.error(`Error fetching user data for post ${post.id}:`, error);
                return { ...post, liked: false, username: "Unknown", profile_pic: "" }; // Fallback values
              }
            })
          );
    
          setPosts(postsWithUserData);
        })
        .catch((err) => console.error("Error fetching posts:", err));
    }, []);
    

  // Handle Like Button Click
  const toggleLike = async(postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: post.liked }
          : post
      )
    );
    try {
      await fetch("https://x8ki-letl-twmt.n7.xano.io/api:0Q68j1tU/update/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ posts_id: postId }),
    });
      await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:eA0dhH6K/likes`, {
        method: "POST", // or "PUT" depending on Xano API setup
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users_id: userId, posts_id: postId, liked: !(posts.find((p) => p.id === postId)?.liked ?? false)
        }),
      });
  
    } catch (error) {
      console.error("Error updating like count in Xano:", error);
    }
  };
  

  // Handle Comment Button Click (Opens alert for now, can be modified for UI input)
  const handleCommentClick = (postId: number) => {
    const router = useRouter();
    router.push(`/post/${postId}`); // Navigate to the post page with comments
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
              {/* 🚨 Report Button (Correctly placed on Top-Right) */}
              <button className="absolute top-4 right-4 bg-black/30 p-2 rounded-full text-white hover:text-red-500">
                <FiFlag size={20} />
              </button>

              {/* User Info (Profile Picture Clickable) */}
              <div className="flex items-center gap-4">
                <img
                  src={post.profile_pic || "/default-avatar.png"} // Fallback image
                  alt="User"
                  className="w-10 h-10 rounded-full cursor-pointer"                />
                <div>
                  <p className="text-white font-semibold">{post.username || "Unknown User"}</p>
                  <p className="text-gray-400 text-sm">{post.created_at || "Just now"}</p>
                </div>
              </div>

              {/* Post Image */}  
              <div className="mt-4">
                <img
                  src={post.image_url || "/placeholder.jpg"} // Fallback image
                  alt="Post"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>

              {/* Post Actions (Like, Comment, Share, Views) */}
              <div className="flex items-center gap-6 mt-4 text-gray-400">
                {/* ✅ Like Button */}
                <button
                  className={`flex items-center gap-1 ${post.liked ? "text-red-500" : "text-gray-400"}`}
                  onClick={() => toggleLike(post.id)}
                >
                  <FiHeart className="cursor-pointer hover:text-red-500" />
                  <span>{post.likes}</span>
                </button>

                {/* ✅ Comment Button */}
                <button className="flex items-center gap-1" onClick={() => handleCommentClick(post.id)}>
                  <FiMessageCircle className="cursor-pointer hover:text-blue-400" />
                  <span>{post.comment_count || 0}</span>
                </button>

                {/* ✅ Share Button (Now Left of Views) */}
                <button className="flex items-center gap-1 cursor-pointer hover:text-blue-400">
                  <FiShare2 />
                </button>

                {/* ✅ Views (Now Right of Share) */}
                <p className="text-sm">{post.views || 0} Views</p>
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