"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bold, Italic, Underline } from "lucide-react"; // Icons
import {
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  ImageIcon,
  Link,
} from "lucide-react"
import { getAuth, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/app/auth/register-form/firebase";

export default function CoverUpload()  {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isOriginalWork, setIsOriginalWork] = useState(false)
  const [referenceLink, setReferenceLink] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeStyles, setActiveStyles] = useState<string[]>([]); // Tracks active styles
  const [animeList, setAnimeList] = useState<{ id: string; title: string }[]>([]);
  const [filteredAnime, setFilteredAnime] = useState<{ id: string; title: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [firebase_uid, setFirebase_uid] = useState<string | null>(null);

  useEffect(() => {
    // Set persistence and then listen for auth state changes
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Error setting persistence:", error);
        setError(error.message);
      })
      .finally(() => {
        // Auth state listener should always run, even if setPersistence fails
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setFirebase_uid(firebaseUser?.uid || null); // ✅ Store UID when user updates
          setLoading(false);
        });

        return () => unsubscribe();
      });
  }, []);


  const editorRef = useRef<HTMLDivElement>(null);

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    return preCaretRange.toString().length; // Cursor index
  };

  const restoreCursorPosition = (position: number) => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const range = document.createRange();
    let charCount = 0;
    const nodes = editorRef.current.childNodes;

    for (const node of nodes) {
      const textLength = node.textContent?.length ?? 0;

      if (charCount + textLength >= position) {
        try {
          range.setStart(node, Math.min(position - charCount, textLength));
          range.setEnd(node, Math.min(position - charCount, textLength));
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          console.error("Failed to restore cursor:", error);
        }
        break;
      }

      charCount += textLength;
    }
  };

  // Apply or Remove Formatting
  const applyStyle = (style: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) return;

    document.execCommand('styleWithCSS', false, 'true');
    
    switch (style) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
    }

    // Update active styles
    updateActiveStyles();
  };

  // New helper function to update active styles
  const updateActiveStyles = () => {
    const newActiveStyles = [];
    if (document.queryCommandState('bold')) newActiveStyles.push('bold');
    if (document.queryCommandState('italic')) newActiveStyles.push('italic');
    if (document.queryCommandState('underline')) newActiveStyles.push('underline');
    setActiveStyles(newActiveStyles);
  };

  // Handle file selection (but don't upload yet)
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  // Add this function back
  const buttonClass = (tag: string) =>
    `p-1.5 rounded transition-colors ${
      activeStyles.includes(tag) ? "bg-[#3A3A3A]" : "hover:bg-[#3A3A3A]"
    }`;

      // Fetch anime list from Xano
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:8BJgb0Hk/animes1"); // Replace with actual Xano API URL
        const data = await response.json();
        setAnimeList(data);
        setFilteredAnime(data);
      } catch (error) {
        console.error("Failed to fetch anime:", error);
      }
    };

    fetchAnime();
  }, []);

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredAnime(
      animeList.filter((anime) => anime.title.toLowerCase().includes(query))
    );
  };

   // Upload when Submit is clicked
   const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "image-upload-1"); // Replace with your Cloudinary upload preset
    formData.append("folder", "Posts"); // Optional folder

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/difdc39kr/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Upload failed: ${data.error?.message || "Unknown error"}`);
      }
      sendToXano(data.secure_url); // Send data to Xano
      alert("Image uploaded successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const sendToXano = async (link: string) => {
    try {
      const response2 = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_uid: firebase_uid,
      }),
    });;
      const data2 = await response2.json();
      const response3 = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:8BJgb0Hk/anime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedAnime,
      }),
      });
      const data3 = await response3.json();
      const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:0Q68j1tU/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          users_id : data2,
          animes1_id: data3,
          title : title,
          image_url: link,
          content: content,
          collection: selectedCollection,
          OG_Work: isOriginalWork,
          ref_link: referenceLink,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      alert("Post created successfully!");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-6">
      <h1 className="text-2xl font-semibold mb-8">Post</h1>

      {/* Cover Image Section */}
      <div className="mb-6">
      <Label>Cover</Label>
      <div className="mt-2 relative">
        {previewImage ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image src={previewImage} alt="Cover" layout="fill" objectFit="cover" className="w-full h-full" />
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4"
              onClick={() => {
                setSelectedFile(null);
                setPreviewImage(null);
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="relative">
            <input type="file" accept="image/*" className="hidden" id="cover-upload" onChange={handleCoverUpload} />
            <label
              htmlFor="cover-upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors cursor-pointer w-fit"
            >
              <ImageIcon className="w-4 h-4" />
              Add Cover
            </label>
          </div>
        )}
      </div>
      </div>

      {/* Title Section */}
      <div className="mb-6">
        <Label>Title</Label>
        <div className="relative mt-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="Please enter title (required)"
            className="bg-[#2A2A2A] border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{title.length}/200</span>
        </div>
      </div>

      <Label>Content</Label>

      {/* Toolbar */}
      <div className="bg-[#2A2A2A] p-2 flex gap-2 border-b border-[#3A3A3A]">
        <button
          className={buttonClass("bold")}
          onClick={() => applyStyle("bold")}
        >
          <Bold className="w-4 h-4 text-white" />
        </button>
        <button
          className={buttonClass("italic")}
          onClick={() => applyStyle("italic")}
        >
          <Italic className="w-4 h-4 text-white" />
        </button>
        <button
          className={buttonClass("underline")}
          onClick={() => applyStyle("underline")}
        >
          <Underline className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        className="w-full h-64 p-4 bg-[#2A2A2A] text-white resize-none focus:outline-none border border-[#3A3A3A] rounded-lg mt-2 overflow-auto"
        onSelect={updateActiveStyles}
        onInput={(e) => {
          // Update content state with the current HTML content
          setContent(e.currentTarget.innerHTML);
        }}
      />

      {/* Collection Selector */}
      <div className="mb-6">
        <Label>Select Collection</Label>
        <Select onValueChange={setSelectedCollection}>
          <SelectTrigger className="mt-2 bg-[#2A2A2A] border-0">
            <SelectValue placeholder="Select Collection" />
          </SelectTrigger>
          <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
            <SelectItem value="Fanart">Fanart</SelectItem>
            <SelectItem value="Memes">Memes</SelectItem>
            <SelectItem value="Discussion">Discussion</SelectItem>
            <SelectItem value="Theory">Theory</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interest Group Selector */}
      <div className="mb-6">
        <Label>Select Interest Group</Label>
        <div className="relative mt-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search anime..."
            className="w-full bg-[#2A2A2A] border border-[#3A3A3A] text-white px-3 py-2 rounded"
          />
          {searchQuery && (
            <div className="absolute w-full max-h-60 overflow-y-auto mt-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg z-50">
              {filteredAnime.length > 0 ? (
                filteredAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="px-3 py-2 hover:bg-[#3A3A3A] cursor-pointer"
                    onClick={() => {
                      setSelectedAnime(anime.title);
                      setSearchQuery("");
                    }}
                  >
                    {anime.title}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-400">No results found</div>
              )}
            </div>
          )}
          {selectedAnime && (
            <div className="mt-2 text-gray-300">Selected: {selectedAnime}</div>
          )}
        </div>
      </div>

      {/* Copyright Settings */}
      <div className="mb-6">
        <Label>Copyright Settings</Label>
        <div className="mt-2 flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
          <span>This is my original work</span>
          <Switch
            checked={isOriginalWork}
            onCheckedChange={setIsOriginalWork}
            className="relative w-12 h-6 bg-gray-400 data-[state=checked]:bg-gray-600 border-none rounded-full transition-colors before:absolute before:top-1 before:left-1 before:w-4 before:h-4 before:rounded-full before:bg-white before:shadow-md before:transition-transform data-[state=checked]:before:translate-x-6"
          />
        </div>
        {!isOriginalWork && (
          <div className="mt-2 relative">
            <Input
              value={referenceLink}
              onChange={(e) => setReferenceLink(e.target.value)}
              placeholder="Click to paste the reference link"
              className="bg-[#2A2A2A] border-0 pr-10"
            />
            <Link className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      {/* Community Guidelines */}
      <div className="text-sm text-gray-400">
        Check the{" "}
        <a href="#" className="text-blue-400 hover:underline">
        &quot;Community Guidelines&quot;
        </a>{" "}
        before posting to maintain community order together.
      </div>
      
      {/* Submit Button */}
       <Button
        onClick={handleSubmit}
        disabled={!selectedFile}
        className="mt-4 px-6 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
      >
        Submit
      </Button>
    
    </div>
  )
}
