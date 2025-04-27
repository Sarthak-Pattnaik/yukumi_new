"use client"; // Ensures this is a client component

import { useState, useEffect, useRef } from "react";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { Card } from "@/components/ui/card";
import { TopNav } from "@/components/top-nav";
import { FiShare2, FiFlag, FiHeart, FiMessageCircle } from "react-icons/fi"; // Importing icons
import { FaHeart } from "react-icons/fa"; // Filled heart
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";


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

interface UserEntry {
  id: number
  created_at: string
  firebase_uid: string
  username: string
  picture_url: string
  auth_provider: string
  display_name: string
  gender: string[]
  country: string
  age: number
  favourites: number[]
}


export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [firebase_uid, setFirebase_uid] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserEntry | null>(null);
    const { user, loading } = useAuth();
    const router = useRouter();
    

    useEffect(() => {
      if (!loading) {
        if (user){
          setFirebase_uid(user.uid); // Update firebase_uid when user is set
        }
      }
}, [user, loading]);

//START FETCHING USER DATA HERE

const fetchUserData = async() => {
  console.log("peek");

      try{
      const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({ firebase_uid: firebase_uid }),
          });
      const data = await response.json();
      setUserId(data); // Set userId from the response
      const response2 = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users/${data}`);
      const data2 = await response2.json();      
      setUserData(data2);  
      return data2;    
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