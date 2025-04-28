"use client";

import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");
  const [displayName, setDisplayName] = useState<string>("Loading...");
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const { user, loading } = useAuth();
  const router = useRouter();

  // Firebase Authentication
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login-page"); // Redirect if not logged in
      } else {
        setFirebaseUid(user.uid); // Update firebase_uid when user is set
        fetchUserData(); // Fetch user ID from Xano
      }
    }
  }, [user, loading, router]);

  // Fetch user data from Xano based on Firebase UID
  const fetchUserData = async () => {
    try {
      if (firebaseUid) {
        console.log("Fetching User ID for:", firebaseUid);
        
        const response = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firebase_uid: firebaseUid }),
          }
        );

        const data = await response.json();
        console.log("User Data Response:", data);
        setUserId(data); // Set user ID received from Xano
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user details from Xano
  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      if (userId) {
        console.log("Fetching details for user ID:", userId);
        const response = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users/${userId}`
        );
        const userDetails = await response.json();
        console.log("Final user details:", userDetails);

        // Update avatar URL and display name
        setAvatarUrl(userDetails.picture_url || "/placeholder.svg");
        setDisplayName(userDetails.display_name || "Anonymous");
        setProfileImage(userDetails.picture_url || null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Handle profile image upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image-upload-1");
    formData.append("folder", "DisplayPicture");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/difdc39kr/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Upload failed: ${data.error?.message || "Unknown error"}`);
      }

      const newAvatarUrl = data.secure_url;
      setProfileImage(newAvatarUrl);
      
      // Update avatar URL in Xano
      await updateUserProfile({ picture_url: newAvatarUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Update user details in Xano (Display Name and Avatar)
  const updateUserProfile = async (updates: { picture_url?: string, display_name?: string }) => {
    if (!userId) return;
    try {
      const response = await fetch(
        `https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );
      const updatedUser = await response.json();
      console.log("Updated User:", updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  // Editable display name logic
  const handleSaveDisplayName = () => {
    updateUserProfile({ display_name: displayName });
    setEditMode(false); // Exit edit mode after saving
  };

  return (
    <div className="flex items-center gap-6 p-6 bg-background/50 rounded-lg">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileImage || avatarUrl} />
          <AvatarFallback>DP</AvatarFallback>
        </Avatar>

        <label
          htmlFor="profile-upload"
          className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#d600db] text-white"
        >
          <Upload className="h-3 w-3" />
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* Display Name */}
      <div className="flex items-center gap-2">
        {editMode ? (
          <>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-48 bg-white text-black rounded px-2 py-1"
            />
            <button
              className="text-sm text-white bg-[#d600db] px-3 py-1 rounded"
              onClick={handleSaveDisplayName}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <span className="text-xl text-white font-semibold">{displayName}</span>
            <img
              src="https://res.cloudinary.com/difdc39kr/image/upload/v1745766476/qrl2jons2p0cnbpfypzv.svg"
              alt="Edit Pen"
              className="h-5 w-5 cursor-pointer"
              onClick={() => setEditMode(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}
