"use client"

import { useState, useEffect } from "react"
import { Upload, User, Edit } from "lucide-react" // Import the Edit icon
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

export default function ProfileSetup() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false)
  const [displayName, setDisplayName] = useState("Your Display Name") // Placeholder text
  const [username, setUsername] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [country, setCountry] = useState("")
  
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  if (!user) {
    console.log("No user is logged in");
    return;
  }

  const firebase_uid = user.uid;

  // Submit the form and update user data in Xano
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(firebase_uid);
    console.log(username);
    console.log(profileImage);
    console.log(displayName);
    console.log(age);
    console.log(country);
    try {
      const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users/addDetails", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_uid: firebase_uid,
          username: username,
          picture_url: profileImage,
          display_name: displayName,
          gender: gender,
          country: country,
          age: age
        }),
      });
      console.log(response);
      if (!response.ok) throw new Error("Failed to update profile");
      router.push("/dashboard");
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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
  }

  return (
    <div className="flex min-h-screen bg-[#0c1322]">
      <SidebarProvider>
        <Sidebar />

        <div className="flex-1">
          <div className="h-16 bg-gradient-to-r from-[#d600db] to-[#131424]" />
          <main className="container mx-auto px-4 py-8">
            <div className="rounded-lg bg-[#131424] p-6 shadow-lg">
              <div className="mb-8 flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileImage || "https://res.cloudinary.com/difdc39kr/image/upload/v1745763093/placeholder.svg.svg"} />
                    <AvatarFallback>
                      <User className="h-10 w-10" />
                    </AvatarFallback>
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
                <span className="text-lg font-medium text-white">UPLOAD PROFILE IMAGE</span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-[#86909c]">
                    Username
                  </Label>
                  <Input
                    id="userName"
                    name="username"
                    placeholder="Your Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-[#292d32] bg-[#131424] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-[#86909c]">
                    Display Name
                  </Label>
                  <div className="flex items-center gap-2">
                    {!isEditingDisplayName ? (
                      <span className="text-white">{displayName}</span>
                    ) : (
                      <Input
                        id="displayName"
                        name="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="border-[#292d32] bg-[#131424] text-white"
                      />
                    )}
                    <button
                      className="text-[#d600db] hover:text-white"
                      onClick={() => setIsEditingDisplayName(!isEditingDisplayName)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-[#86909c]">
                    Gender
                  </Label>
                  <Select onValueChange={(value) => setGender(value)} name="gender">
                    <SelectTrigger className="border-[#292d32] bg-[#131424] text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131424] text-white">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-[#86909c]">
                    Country
                  </Label>
                  <Select onValueChange={(value) => setCountry(value)} name="country">
                    <SelectTrigger className="border-[#292d32] bg-[#131424] text-white">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131424] text-white">
                      {/* Populate countries here */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-[#86909c]">
                    Age
                  </Label>
                  <Select onValueChange={(value) => setAge(value)} name="age">
                    <SelectTrigger className="border-[#292d32] bg-[#131424] text-white">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131424] text-white">
                      {/* Populate ages here */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full py-2 bg-[#d600db] text-white rounded-lg font-medium" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

