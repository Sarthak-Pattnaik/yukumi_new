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

catch (error) {
          console.error("Error fetching user anime:", error);
      }
};

// First, read cached userDetails from localStorage outside the query
const cachedUserDetails = typeof window !== "undefined" ? localStorage.getItem(`userDetails_${firebase_uid}`) : null;
const parsedUserDetails = cachedUserDetails ? JSON.parse(cachedUserDetails) : undefined;

const { data: userDetails, error: userQueryError, isLoading: isUserLoading } = useQuery({
  queryKey: ["userDetails", firebase_uid],
  queryFn: async () => {
    console.log("Running queryFn with uid:", firebase_uid);
    if (!firebase_uid) return null;

    const freshUserData = await fetchUserData();

    // Save fresh user details to localStorage
    if (freshUserData) {
      localStorage.setItem(`userDetails_${firebase_uid}`, JSON.stringify(freshUserData));
    }

    return freshUserData;
  },
  enabled: !!firebase_uid,
  initialData: parsedUserDetails,  // 👈 show cached data immediately
  staleTime: 1000,
  gcTime: 1000 * 60 * 2,
  retry: false,
});



//END FETCHING USER DATA HERE
    
const fetchPostsWithUserData = async (): Promise<Post[]> => {
  console.log("Fetching posts with user data...");

  // 1. Fetch all posts
  const postRes = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:0Q68j1tU/posts");
  const posts: Post[] = await postRes.json();

  // 2. Fetch all posts liked by the current user
  const likesRes = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:eA0dhH6K/LikedOrNot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users_id: userId }), 
  // Use userId from the state
  });
  const likesData: { posts_id: number; liked: boolean }[] = await likesRes.json();

  // 3. Create a quick lookup map for liked posts
  const likedPostsMap = new Map<number, boolean>();
  likesData.forEach((like) => {
    if (like.liked) { // Only mark posts where user actually liked
      likedPostsMap.set(like.posts_id, true);
    }
  });

  // 4. Merge liked status into each post
  const postsWithLiked = posts.map((post) => ({
    ...post,
    liked: likedPostsMap.get(post.id) || false, // default to false if not liked
  }));

  // 5. Update local state
  setPosts(postsWithLiked);

  return postsWithLiked;
};

  

  // First, read localStorage outside the query
const cachedPosts = typeof window !== "undefined" ? localStorage.getItem('posts-with-user') : null;
const parsedPosts = cachedPosts ? JSON.parse(cachedPosts) as Post[] : undefined;

const { data: postsWithUser, isLoading, isError } = useQuery<Post[], Error>({
  queryKey: ['posts-with-user'],
  queryFn: async () => {
    const freshPosts = await fetchPostsWithUserData();

    // After fetching, update localStorage
    if (freshPosts) {
      localStorage.setItem('posts-with-user', JSON.stringify(freshPosts));
    }

    return freshPosts;
  },
  initialData: parsedPosts, // 👈 load cached posts immediately
  staleTime: 1000,          // 👈 stale after 1 second
  gcTime: 1000 * 60 * 2,
  retry: 3,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
});

const updatePostsEverywhere = (updatedPosts: Post[]) => {
  setPosts(updatedPosts);
  if (typeof window !== "undefined") {
    localStorage.setItem('posts-with-user', JSON.stringify(updatedPosts));
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
  const postToUpdate = posts.find((post) => post.id === postId);
  if (!postToUpdate) return;

  const updatedLikes = postToUpdate.liked ? postToUpdate.likes - 1 : postToUpdate.likes + 1;
  const updatedLikedStatus = !postToUpdate.liked;

  const updatedPosts = posts.map((post) =>
    post.id === postId
      ? { ...post, likes: updatedLikes, liked: updatedLikedStatus }
      : post
  );

  // 1. Optimistically update UI
  updatePostsEverywhere(updatedPosts);

  // 2. Update localStorage immediately
  if (typeof window !== "undefined") {
    localStorage.setItem('posts-with-user', JSON.stringify(updatedPosts));
  }

  try {
    // 3. Update likes count in database
    await fetch("https://x8ki-letl-twmt.n7.xano.io/api:0Q68j1tU/update/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts_id: postId, likes: updatedLikes }),
    });

    // 4. Update user's like status
    await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:eA0dhH6K/likes`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        users_id: userId,
        posts_id: postId,
        liked: updatedLikedStatus,
      }),
    });
  } catch (error) {
    console.error("Error updating like count in Xano:", error);
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
                    <FaHeart
                      className="cursor-pointer text-red-500"
                    />
                    ) : (
                    <FiHeart
                      className="cursor-pointer hover:text-red-500"
                    />
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
