"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/top-nav";
import Footer from "@/components/footer";
import { ListPlus, Pause, X, Check, ChevronDown } from "lucide-react";

interface Anime {
  id: number;
  image_url: string;
  title: string;
  type: string;
  episodes: number;
  aired_from: string | null;
  aired_to: string | null;
  genres: string[];
  avg_score: number | null;
  synopsis: string;
}

export default function AnimeDetail() {
  const params = useParams();
  const id = params?.id as string;

  const userId = 1234; // Replace this with the actual logged-in user ID (INTEGER)
  const userIdInt = parseInt(userId.toString(), 10); // Ensure it's treated as an integer

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlistStatus, setWatchlistStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:8BJgb0Hk/animes1/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch anime details");
        }

        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error("Error fetching anime details:", error);
        setError("Failed to load anime details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimeDetails();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    const animeIdInt = parseInt(id, 10); // Convert anime ID to integer

    if (isNaN(userIdInt) || isNaN(animeIdInt)) {
      console.error("Invalid user_id or animes1_id. Must be an integer.");
      return;
    }

    if (watchlistStatus === newStatus) {
      setWatchlistStatus(null);
    } else {
      setWatchlistStatus(newStatus);

      try {
        const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:P5mUuktq/user_anime", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userIdInt, // Now ensured as an integer
            animes1_id: animeIdInt, // Now ensured as an integer
            status: newStatus,
            progress: 0,
            score: 1, // Default score
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update watchlist");
        }

        console.log("Successfully updated watchlist in Xano");
      } catch (error) {
        console.error("Error updating watchlist:", error);
      }
    }
  };

  if (loading) return <p className="text-center text-gray-300">Loading anime details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!anime) return <p className="text-center text-gray-400">Anime not found</p>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Column - Image & Community */}
          <div className="space-y-4">
            {/* Anime Image */}
            <div className="bg-white p-4 flex justify-center items-center h-[400px]">
              <Image
                src={anime.image_url || "/placeholder.svg"}
                alt={anime.title || "Anime image"}
                width={300}
                height={450}
                className="rounded-lg"
              />
            </div>

            {/* Join Community Button */}
            <button className="w-full py-3 bg-[#4f74c8] text-white font-medium rounded hover:bg-[#1c439b] transition-colors">
              JOIN COMMUNITY
            </button>

            {/* Streaming Platforms */}
            <div className="bg-[#f8f8f8] text-black p-4 rounded">
              <h3 className="font-bold mb-3">Streaming Platforms</h3>
              <div className="space-y-3">
                <Link href="https://www.crunchyroll.com" className="flex items-center space-x-2 hover:bg-gray-200 p-1 rounded">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-xs">CR</span>
                  </div>
                  <span>Crunchyroll</span>
                </Link>

                <Link href="https://www.netflix.com" className="flex items-center space-x-2 hover:bg-gray-200 p-1 rounded">
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-white text-xs">N</span>
                  </div>
                  <span>Netflix</span>
                </Link>

                <button className="flex items-center text-[#1c439b] hover:underline">
                  <ChevronDown className="h-4 w-4 mr-1" />
                  <span>More services</span>
                </button>

                <p className="text-xs text-gray-500 mt-2">May be unavailable in your region.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Anime Details */}
          <div className="md:col-span-3 space-y-4">
            {/* Title & Synopsis */}
            <div className="bg-white text-black p-6">
              <h1 className="text-3xl font-bold">{anime.title}</h1>
              <p className="text-gray-700 mt-2">{anime.synopsis || "No synopsis available."}</p>
            </div>

            {/* Watchlist Actions */}
            <div className="bg-white p-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Add to My List", icon: <ListPlus className="h-4 w-4 mr-2" />, status: "Add to My List" },
                  { label: "ON-HOLD", icon: <Pause className="h-4 w-4 mr-2" />, status: "On-Hold" },
                  { label: "DROPPED", icon: <X className="h-4 w-4 mr-2" />, status: "Dropped" },
                  { label: "COMPLETED", icon: <Check className="h-4 w-4 mr-2" />, status: "Completed" },
                ].map(({ label, icon, status }) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`flex items-center px-3 py-1.5 rounded text-sm ${watchlistStatus === status ? "bg-[#1c439b] text-white" : "bg-[#f8f8f8] text-[#323232] hover:bg-gray-300"}`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Watch Now Button */}
            <Button className="bg-[#B624FF] hover:bg-[#B624FF]/80 text-white px-6 py-3 text-lg w-full">
              Watch Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
