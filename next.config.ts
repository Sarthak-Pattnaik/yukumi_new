import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 🚀 Disables Strict Mode to speed up development
  webpack: (config) => {
    config.resolve.symlinks = false; // ✅ Prevents duplicate module resolution issues
    return config;
  },
  images: {
    loader: "default",
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
};

export default nextConfig;
