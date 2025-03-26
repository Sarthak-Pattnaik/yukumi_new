"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, User } from "lucide-react"
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

export default function ProfileSetup() {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);

  const [userData, setUserData] = useState({
    username: "",
    pictureUrl: "",
    displayName: "",
    gender: "",
    country: "",
    age: "",
  });
const [username, setUsername] = useState("");
const [displayName, setDisplayName] = useState("");
const [age, setAge] = useState("");
const [gender, setGender] = useState("");
const [country, setCountry] = useState("");

  
const auth = getAuth();
const user = auth.currentUser;
const router = useRouter();

if (!user) {
  console.log("No user is logged in");
  return;
}

const firebase_uid = user.uid;

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement> | string,
  field?: string
) => {
  if (typeof e === "string" && field) {
    // Handling ShadCN <Select> (string values)
    setUserData((prev) => ({ ...prev, [field]: e }));
  } else if (e instanceof Event && "target" in e) {
    // Handling <input> fields (event object)
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }
};
  

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

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        const countryList = data
          .map((country: any) => ({
            code: country.cca2.toLowerCase(), // Alpha-2 country code (e.g., "US")
            name: country.name.common, // Full country name
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name)); // Sort alphabetically
  
        setCountries(countryList);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);
  

  const handleImageUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image-upload-1"); // Replace with your Cloudinary upload preset
    formData.append("folder", "DisplayPicture"); // Optional folder

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/difdc39kr/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Upload failed: ${data.error?.message || "Unknown error"}`);
      }
      setProfileImage(data.secure_url); // Send data to Xano
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
                  <AvatarImage src={profileImage || "/placeholder.svg?height=80&width=80"} />
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
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder="Your Display Name"
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border-[#292d32] bg-[#131424] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-[#86909c]">
                  Gender
                </Label>
                <Select onValueChange={(value) => setGender(value)} name="gender">
                  <SelectTrigger className="border-[#292d32] bg-[#131424] text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131424] text-white" >
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
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                  ))}
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
                  <SelectContent className="bg-[#131424] text-white" >
                    {Array.from({ length: 88 }, (_, i) => 13 + i).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                    {age}
                    </SelectItem>
                     ))}
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

