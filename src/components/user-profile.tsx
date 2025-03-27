"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function UserProfile() {
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");
  const [displayName, setDisplayName] = useState<string>("Loading...");
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUid(user.uid);
        await fetchUserData(user.uid);
      }
    });
  }, []);

  const fetchUserData = async (firebaseUid: string) => {
    try {
      console.log("Fetching User ID for:", firebaseUid);

      // Step 1: Fetch user ID from Xano
      const response = await fetch(
        `https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users?firebase_uid=${firebaseUid}`
      );

      if (!response.ok) throw new Error(`Failed to fetch user ID. API Response: ${await response.text()}`);

      const data = await response.json();
      console.log("User Data Response:", data);

      if (data.length > 0) {
        console.log("User found. ID:", data[0].id);
        setUserId(data[0].id);

        await fetchUserDetails(data[0].id);
      } else {
        await createNewUser(firebaseUid);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserDetails = async (userId: number) => {
    try {
      console.log("Fetching details for user ID:", userId);

      const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users/${userId}`);

      if (!response.ok) throw new Error(`Failed to fetch user details. API Response: ${await response.text()}`);

      const userDetails = await response.json();
      console.log("Final user details:", userDetails);

      setAvatarUrl(userDetails.profile_pic || "/placeholder.svg");
      setDisplayName(userDetails.display_name || "Anonymous");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const createNewUser = async (firebaseUid: string) => {
    try {
      console.warn("User not found. Creating new user...");

      const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebase_uid }),
      });

      if (!response.ok) throw new Error(`Failed to create user. API Response: ${await response.text()}`);

      const newUser = await response.json();
      console.log("New user created:", newUser);
      setUserId(newUser.id);

      await fetchUserDetails(newUser.id);
    } catch (error) {
      console.error("Error creating new user:", error);
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
