"use client"

import { useEffect, useState } from "react"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { TopNav } from "@/components/top-nav"
import Footer from "@/components/footer"

interface Anime {
  id: number
  image_url: string
  title: string
  type: string
  episodes: number
  aired_from: string
  aired_to: string
  genres: string[]
  avg_score: number
}



export default function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>([]); // Full dataset from Xano
  const [displayedAnime, setDisplayedAnime] = useState<Anime[]>([]); // Paginated data
  const [userScores, setUserScores] = useState<Record<number, number>>({}); // Stores user's scores
  const [userStatuses, setUserStatuses] = useState<Record<number, string>>({}); // Stores user's watch status
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Assume auth system is in place
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    }
    return [];
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
  
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // ✅ Save to localStorage
      return updatedFavorites;
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return " ";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:8BJgb0Hk/animes1"); // Fetch entire dataset
        const data = await response.json();
        console.log("Full Anime Data:", data); // ✅ Debugging

        const sortedData = data.sort((a: Anime, b: Anime) => b.avg_score - a.avg_score);
        setAnimeList(sortedData);
        setDisplayedAnime(sortedData.slice(0, 50)); // Load first 50
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
      setLoading(false);
    };

    fetchAnime();
  }, []);

  useEffect(() => {
    // Fetch user's scores & statuses (Assuming logged-in user data is stored in Xano)
    const fetchUserData = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:P5mUuktq/user_anime"); // Replace with actual endpoint
        const userData = await response.json();
        
        const scores: Record<number, number> = {};
        const statuses: Record<number, string> = {};

        userData.forEach((entry: { anime_id: number; score: number; status: string }) => {
          scores[entry.anime_id] = entry.score;
          statuses[entry.anime_id] = entry.status;
        });

        setUserScores(scores);
        setUserStatuses(statuses);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  const updateDisplayedAnime = (newPage: number) => {
    const startIndex = (newPage - 1) * 50;
    const nextBatch = animeList.slice(startIndex, startIndex + 50);

    if (nextBatch.length > 0) {
      setDisplayedAnime(nextBatch);
      setPage(newPage);
    }
  };

  const loadNextPage = () => {
    if (page * 50 < animeList.length) {
      updateDisplayedAnime(page + 1);
    }
  };

  const loadPreviousPage = () => {
    if (page > 1) {
      updateDisplayedAnime(page - 1);
    }
  };

  if (loading && displayedAnime.length === 0) return <p>Loading anime...</p>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <TopNav />
      {/* Hero Section */}
      <div className="text-center space-y-8 relative py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white">FIND THE BEST ANIME FOR YOU</h1>
        <Button className="bg-[#B624FF] hover:bg-[#B624FF]/80 text-white px-8 py-6 text-xl h-auto">TRY NOW</Button>
      </div>

      {/* Anime List */}
      <div className="anime-list-container overflow-auto rounded-lg border border-white/10 bg-card">
        <table className="w-full anime-table">
          <thead>
            <tr className="bg-black/20">
              <th className="p-4 text-left ">Number</th>
              <th className="p-4 text-center w-1/">Anime Title</th>
              <th className="p-4 text-center ">Score</th>
              <th className="p-4 text-center ">Your Score</th>
              <th className="p-4 text-center ">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedAnime.map((anime) => (
              <tr key={anime.id} className="border-t border-white/10 hover:bg-white/5">
          
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={anime.image_url || "/placeholder.svg"}
                      alt={anime.title}
                      width={60}
                      height={80}
                      className="rounded"
                    />
                    </div>
                    </td>
                    <td className="p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{anime.title}</span>
                        <button onClick={() => toggleFavorite(anime.id)} className="text-red-500 hover:text-red-400">
                          <Heart className={`w-4 h-4 ${favorites.includes(anime.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div className="text-sm text-gray-400">
                        {anime.type} ({anime.episodes} eps)
                      </div>
                      <div className="text-sm text-gray-400">
                          {formatDate(anime.aired_from)} to {anime.aired_to ? formatDate(anime.aired_to) : "Ongoing"}
                      </div>
                    </div>
                  
                </td>
                <td><div className="text-m text-white"> {anime.avg_score ? anime.avg_score.toFixed(2) : "-"}</div></td>
                <td className="p-4">
                <div className="text-xs text-white flex items-center gap-4">
                  {isLoggedIn ? (userScores[anime.id] ?? "-") : "-"}<Star />
                </div>
                </td>

                <td className="p-4">
                <div className="text-xs text-white flex items-center gap-4">
                    {isLoggedIn ? (userStatuses[anime.id] ?? 
                  <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                    Add to List
                    </button>) : "-"}
                </div>
                </td>
    
          
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={loadPreviousPage}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300"
        >
          Previous 50
        </button>

        <button
          onClick={loadNextPage}
          disabled={page * 50 >= animeList.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300"
        >
          Next 50
        </button>
      </div>
      <Footer />
    </div>
  )
}

