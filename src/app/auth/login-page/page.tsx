"use client";

import { Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      if (user) {
        const idToken = await user.getIdToken();

        // Verify user in Xano
        const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: user.email, idToken })
        });

        const result = await response.json();
        console.log("Xano API Response:", result); // 🔥 Log the response
        if (!response.ok) throw new Error(result.message || "Xano verification failed");

        // Success
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-green-500/20 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute bottom-40 right-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="w-full max-w-md p-8 space-y-8 relative z-10">
        <h1 className="text-4xl font-bold text-center text-white mb-12">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-900 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-white/60 text-sm">or</span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <div className="flex justify-center gap-6">
          <Link
            href="/auth/google"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4285f4] hover:opacity-90 transition-opacity"
          >
            <Image src="/placeholder.svg?height=24&width=24" alt="Google" width={24} height={24} className="w-6 h-6" />
          </Link>

          <Link
            href="/auth/facebook"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1877f2] hover:opacity-90 transition-opacity"
          >
            <Facebook className="w-6 h-6 text-white" />
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/signup"
            className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-purple-900 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
