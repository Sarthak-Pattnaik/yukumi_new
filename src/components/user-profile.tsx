"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");
  const [displayName, setDisplayName] = useState<string>("Loading...");
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const { user, loading } = useAuth();
      const router = useRouter();
    
      useEffect(() => {
        if (!loading) {
          if (!user) {
            router.push("/auth/login-page"); // Redirect if not logged in
          } else {
            setFirebaseUid(user.uid); // Update firebase_uid when user is set
            fetchUserData();
          }
        }
      }, [user, loading, router]);

      useEffect(() => {
        if (firebaseUid) {
          console.log("Fetching User ID for:", firebaseUid);
          fetchUserData();
        }
      }, [firebaseUid]);

      useEffect(() => {
        if (userId) {
          fetchUserDetails();
        }
      }, [userId]);

  const fetchUserData = async () => {
    try {
      console.log("Fetching User ID for:", firebaseUid);

      // Step 1: Fetch user ID from Xano
      
      const response = await fetch(
        `https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users`, {
          method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebase_uid: firebaseUid }),
        }
      );
      //console.log(response);
      //if (!response.ok) throw new Error(`Failed to fetch user ID. API Response: ${await response.text()}`);

      const data = await response.json();
      console.log("User Data Response:", data);
      setUserId(data);
     
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      console.log("hello");
      console.log("Fetching details for user ID:", userId);

      const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users/${userId}`);

      //if (!response.ok) throw new Error(`Failed to fetch user details. API Response: ${await response.text()}`);

      const userDetails = await response.json();
      console.log("Final user details:", userDetails);

      setAvatarUrl(userDetails.picture_url || "/placeholder.svg");
      setDisplayName(userDetails.display_name || "Anonymous");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };



  return (
    <div className="flex items-start gap-6 p-6 bg-background/50 rounded-lg">
      <div className="relative">
        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-bold">{displayName}</h2>
      </div>
    </div>
  );
}
