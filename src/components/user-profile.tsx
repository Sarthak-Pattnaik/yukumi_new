"use client";

import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function UserProfile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("Your Display Name");
  const [editMode, setEditMode] = useState<boolean>(false);

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
      setProfileImage(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="flex items-center gap-6 p-6">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileImage || "https://res.cloudinary.com/difdc39kr/image/upload/v1745763093/placeholder.svg.svg"} />
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
              onClick={() => setEditMode(false)}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <span className="text-xl text-white font-semibold">{displayName}</span>
            <img
              src="https://res.cloudinary.com/difdc39kr/image/upload/v1745764546/zdj84gi4dhzrxcscn1lp.svg"
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