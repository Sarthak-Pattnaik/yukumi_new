"use client";

import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion"
import { useRouter } from "next/navigation";
import { auth, googleProvider, facebookProvider  } from "../register-form/firebase";
import { getAuth, signInWithEmailAndPassword, UserCredential, signInWithPopup, signInWithRedirect, getRedirectResult, getAdditionalUserInfo } from "firebase/auth";
import { toast } from "react-hot-toast";

function Separator({ className = "" }: { className?: string }) {
  return <div className={`h-[1px] bg-white/20 ${className}`} />;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google using a popup
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      console.log("Firebase authentication successful:", user.uid);
  
      // 🔥 Extract additionalUserInfo properly
      const additionalUserInfo = getAdditionalUserInfo(result);
      const id_token = await user.getIdToken();
      if(additionalUserInfo){
        const isNewUser = additionalUserInfo.isNewUser;
  
      if (isNewUser) {
        console.log("New user detected. Creating record in Xano...");
  
        // Create new user in Xano
        const createResponse = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebase_uid: user.uid,
            auth_provider: "google",
            idToken: id_token
          }),
        });
  
        if (!createResponse.ok) throw new Error("Failed to create new user in Xano");
        console.log("New user successfully registered in Xano.");
      }
      } else {
        console.log("Existing user. Verifying login with Xano...");
  
        // Verify existing user in Xano
        const loginResponse = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: id_token }),
        });
  
        if (!loginResponse.ok) throw new Error("Xano verification failed");
        console.log("User successfully verified in Xano.");
      }
  
      toast.success("Google login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.message || "Google sign-in failed.");
    }
  };
  
  const handleFacebookSignIn = async () => {
    try {
      // If no user is signed in, initiate Facebook login
      if (!auth.currentUser) {
        await signInWithRedirect(auth, facebookProvider);
      }
    } catch (error: any) {
      console.error("Facebook Sign-In Error:", error);
      toast.error(error.message || "Facebook sign-in failed.");
    }
  };
  
  // Function to handle redirect result when page loads
  const checkRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      console.log("Redirect result:", result);
      if (result) {
        const user = result.user;
        console.log("Firebase authentication successful:", user.uid);
  
        // Check if the user is new
        const additionalUserInfo = getAdditionalUserInfo(result);
        const id_token = await user.getIdToken();
  
        if (additionalUserInfo) {
          const isNewUser = additionalUserInfo.isNewUser;
  
          if (isNewUser) {
            console.log("New user detected. Creating record in Xano...");
  
            // Create new user in Xano
            const createResponse = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                firebase_uid: user.uid,
                auth_provider: "facebook",
                idToken: id_token
              }),
            });
  
            if (!createResponse.ok) throw new Error("Failed to create new user in Xano");
            console.log("New user successfully registered in Xano.");
          } else {
            console.log("Existing user. Verifying login with Xano...");
  
            // Verify existing user in Xano
            const loginResponse = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: id_token }),
            });
  
            if (!loginResponse.ok) throw new Error("Xano verification failed");
            console.log("User successfully verified in Xano.");
          }
        } else {
          console.log("No additional user info available.");
          // Handle the case where additionalUserInfo is null
        }
  
        toast.success("Facebook login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Facebook Sign-In Error:", error);
      toast.error(error.message || "Facebook sign-in failed.");
    }
  };

  useEffect(() => {
    checkRedirectResult();
  }, []);
  
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
        
        const id_token = await user.getIdToken();

        // Verify user in Xano
        const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            firebase_uid: user.uid,
            idToken: id_token })
        });

        const result = await response.json();
        console.log("Xano API Response:", result); // 🔥 Log the response
        
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


            <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <Separator className="w-16" />
                    <span className="text-sm text-white/70">or</span>
                    <Separator className="w-16" />
                  </div>
                  <span className="text-sm text-white/70">sign in with</span>
                  <div className="flex space-x-4">
                  <SocialButton
                      icon={<GoogleIcon className="h-5 w-5" />}
                      onClick={handleGoogleSignIn} // Call the function here
                      label="Sign up with Google"
                      className="bg-[#4285F4]"
                    />
                   <SocialButton
                      icon={<FacebookIcon className="h-5 w-5" />}
                      onClick={handleFacebookSignIn}
                      label="Sign up with Facebook"
                      className="bg-[#3B5998]"
                    />
                  </div>
              </motion.div>

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

function SocialButton({ 
  icon, 
  onClick, 
  label, 
  className 
}: { 
  icon: React.ReactNode
  onClick: () => void
  label: string
  className: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-opacity hover:opacity-90 ${className}`}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
}




function GoogleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      {...props}
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function FacebookIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      {...props}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}