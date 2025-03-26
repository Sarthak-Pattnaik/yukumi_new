"use client";

import { useEffect, useState } from "react";
import { Heart, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TopNav } from "@/components/top-nav";
import Footer from "@/components/footer";
import Link from "next/link";

interface Anime {
  id: number;
  image_url: string;
  title: string;
  type: string;
  episodes: number;
  aired_from: string;
  aired_to: string;
  genres: string[];
  avg_score: number;
}

export default function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [displayedAnime, setDisplayedAnime] = useState<Anime[]>([]);
  const [userScores, setUserScores] = useState<Record<number, number>>({});
  const [userStatuses, setUserStatuses] = useState<Record<number, string>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:8BJgb0Hk/animes1");
        const response2 = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:8BJgb0Hk/fetchanimedata/updateAvgScore");
        const data = await response.json();

        const sortedData = data.sort((a: Anime, b: Anime) => b.avg_score - a.avg_score);
        setAnimeList(sortedData);
        setDisplayedAnime(sortedData.slice(0, 50));
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
      setLoading(false);
    };

    fetchAnime();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:P5mUuktq/user_anime");
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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setDisplayedAnime(animeList.slice(0, 50));
      return;
    }

    const filteredAnime = animeList.filter((anime) =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedAnime(filteredAnime);
  }, [searchQuery, animeList]);

  const loadNextPage = () => {
    if (page * 50 < animeList.length) {
      setDisplayedAnime(animeList.slice(page * 50, (page + 1) * 50));
      setPage(page + 1);
    }
  };

  const loadPreviousPage = () => {
    if (page > 1) {
      setDisplayedAnime(animeList.slice((page - 2) * 50, (page - 1) * 50));
      setPage(page - 1);
    }
  };

  if (loading && displayedAnime.length === 0) return <p>Loading anime...</p>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <TopNav />

      {/* Hero Section */}
      <div className="text-center space-y-8 relative py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white">FIND THE BEST ANIME FOR YOU</h1>
        <Button className="bg-[#B624FF] hover:bg-[#B624FF]/80 text-white px-8 py-6 text-xl h-auto">
          TRY NOW
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-500 rounded-md bg-black text-white"
          />
        </div>
      </div>

      {/* Anime List */}
      <div className="anime-list-container overflow-auto rounded-lg border border-white/10 bg-card">
        <table className="w-full anime-table">
          <thead>
            <tr className="bg-black/20">
              <th className="p-4 text-left">Number</th>
              <th className="p-4 text-center">Anime Title</th>
              <th className="p-4 text-center">Score</th>
              <th className="p-4 text-center">Your Score</th>
              <th className="p-4 text-center">Status</th>
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
                  <div className="flex items-center gap-2">
                    {/* Clickable Link to Anime Detail Page */}
                    <Link href={`/anime/${anime.id}`} className="font-medium text-blue-400 hover:underline">
                      {anime.title}
                    </Link>
                    <button onClick={() => toggleFavorite(anime.id)} className="text-red-500 hover:text-red-400">
                      <Heart className={`w-4 h-4 ${favorites.includes(anime.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </td>
                <td>{anime.avg_score?.toFixed(2) || "-"}</td>
                <td>{isLoggedIn ? userScores[anime.id] ?? "-" : "-"}</td>
                <td>{isLoggedIn ? userStatuses[anime.id] ?? "-" : "-"}</td>
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
  );
}
