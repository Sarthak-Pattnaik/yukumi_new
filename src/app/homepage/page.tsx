"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { TopNav } from "@/components/top-nav";
import { Card } from "@/components/ui/card";
import { FiShare2, FiFlag, FiHeart, FiMessageCircle } from "react-icons/fi";
import { FaHeart } from "react-icons/fa"; // Filled heart
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: number;
  created_at: string;
  users_id: number;
  animes1_id: number;
  title: string;
  image_url: string;
  content: string;
  collection: string[];
  OG_Work: boolean;
  ref_link: string;
  likes: number;
  comment_count: number;
  views: number;
  shares: number;
  liked?: boolean;
  username?: string;
  profile_pic?: string;
}

interface UserEntry {
  id: number;
  username: string;
  profile_pic: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  const fetchUserData = async (firebase_uid: string): Promise<UserEntry> => {
    try {
      const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebase_uid }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  // Fetch user data on load and cache it for better performance
  const { data: userDetails, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ["userDetails", user?.uid],
    queryFn: () => fetchUserData(user?.uid || ""),
    enabled: !loading && user !== null,
    retry: 2
  });

  useEffect(() => {
    if (userDetails) {
      setUserId(userDetails.id);
    }
  }, [userDetails]);

  // Fetch posts along with user data
  const fetchPosts = async (): Promise<Post[]> => {
    try {
      const postRes = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:0Q68j1tU/posts");
      const postsData = await postRes.json();

      const postsWithUserData = await Promise.all(
        postsData.map(async (post: Post) => {
          try {
            const userRes = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users/${post.users_id}`);
            const userData = await userRes.json();
            return {
              ...post,
              username: userData.username,
              profile_pic: userData.profile_pic,
              liked: false, // Default liked state
            };
          } catch (error) {
            console.error("Error fetching user data for post:", error);
            return post;
          }
        })
      );

      return postsWithUserData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ["postsWithUserData"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5
  });

  // Handle Like Button Click
  const toggleLike = async (postId: number) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    );

    setPosts(updatedPosts);

    try {
      await fetch("https://x8ki-letl-twmt.n7.xano.io/api:0Q68j1tU/update/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts_id: postId }),
      });

      await fetch("https://x8ki-letl-twmt.n7.xano.io/api:eA0dhH6K/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          users_id: userId,
          posts_id: postId,
          liked: !posts.find((post) => post.id === postId)?.liked,
        }),
      });
    } catch (error) {
      console.error("Error updating like count:", error);
      // Handle error by reverting the optimistic update
      setPosts(posts);
    }
  };

  // Handle Comment Button Click (Redirects to the post detail page)
  const handleCommentClick = (postId: number) => {
    router.push(`/post/${postId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <TopNav />
      <div className="flex gap-6 pt-16">
        {/* Left Sidebar */}
        <div className="w-1/4 hidden lg:block">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          {postsLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-[#2e2e2e] border-0 p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-700 rounded"></div>
                      <div className="h-3 w-16 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="mt-4 h-80 bg-gray-700 rounded-lg"></div>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="h-5 w-12 bg-gray-700 rounded"></div>
                    <div className="h-5 w-12 bg-gray-700 rounded"></div>
                    <div className="h-5 w-12 bg-gray-700 rounded"></div>
                  </div>
                </Card>
              ))
          ) : (
            postsData?.map((post) => (
              <Card key={post.id} className="bg-[#2e2e2e] border-0 p-4 relative">
                <button className="absolute top-4 right-4 bg-black/30 p-2 rounded-full text-white hover:text-red-500">
                  <FiFlag size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <img
                    src={post.profile_pic || "/default-avatar.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div>
                    <p className="text-white font-semibold">{post.username || "Unknown User"}</p>
                    <p className="text-gray-400 text-sm">{formatDate(post.created_at)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <img
                    src={post.image_url || "/placeholder.jpg"}
                    alt="Post"
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </div>
                {post.title && <h3 className="mt-3 text-white font-medium">{post.title}</h3>}
                {post.content && <p className="mt-2 text-gray-300 line-clamp-2">{post.content}</p>}
                <div className="flex items-center gap-6 mt-4 text-gray-400">
                  <button
                    className={`flex items-center gap-1 ${post.liked ? "text-red-500" : "text-gray-400"}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    {post.liked ? (
                      <FaHeart className="cursor-pointer text-red-500" />
                    ) : (
                      <FiHeart className="cursor-pointer hover:text-red-500" />
                    )}
                    <span>{post.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 text-gray-400"
                    onClick={() => handleCommentClick(post.id)}
                  >
                    <FiMessageCircle />
                    <span>{post.comment_count}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-400">
                    <FiShare2 />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-1/4 hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
