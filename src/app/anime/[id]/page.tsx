"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/top-nav";
import Footer from "@/components/footer";

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
  const id = params?.id as string; // Ensure id is treated as a string

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p className="text-center text-gray-300">Loading anime details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!anime) return <p className="text-center text-gray-400">Anime not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <TopNav />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Anime Image */}
        <div className="flex justify-center">
          <Image
            src={anime.image_url || "/placeholder.svg"}
            alt={anime.title || "Anime image"}
            width={300}
            height={450}
            className="rounded-lg"
          />
        </div>

        {/* Anime Details */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">{anime.title}</h1>
          <p className="text-gray-400">{anime.synopsis || "No synopsis available."}</p>
          <p><strong>Type:</strong> {anime.type || "Unknown"}</p>
          <p><strong>Episodes:</strong> {anime.episodes ?? "N/A"}</p>
          <p><strong>Aired:</strong> {anime.aired_from ?? "?"} - {anime.aired_to ?? "?"}</p>
          <p><strong>Genres:</strong> {Array.isArray(anime.genres) ? anime.genres.join(", ") : "N/A"}</p>
          <p><strong>Average Score:</strong> {anime.avg_score ? anime.avg_score.toFixed(2) : "N/A"}</p>

          {/* Watch Now Button */}
          <Button className="bg-[#B624FF] hover:bg-[#B624FF]/80 text-white px-6 py-3 text-lg">
            Watch Now
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

