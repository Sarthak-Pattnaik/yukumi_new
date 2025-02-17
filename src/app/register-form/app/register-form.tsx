"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { auth, googleProvider, facebookProvider  } from "../firebase";
import { signInWithPopup, getAuth, AuthError, createUserWithEmailAndPassword } from "firebase/auth";


interface FormData {
  email: string
  password: string
  confirmPassword: string
}

// Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        className={`h-12 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input"

// Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <button
        className={`inline-flex h-12 items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button"

// Separator component
function Separator({ className = "" }: { className?: string }) {
  return <div className={`h-[1px] bg-white/20 ${className}`} />;
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken(); // Get the ID Token
  
      // Send the token to Xano
      const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_token: idToken }),
      });
  
      const data = await response.json();
      console.log("Response from Xano:", data);
  
      toast.success(`Welcome, ${user.displayName}!`);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed. Try again.");
    }
  };
  
  
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
  
      // Get the ID token from Firebase
      const idToken = await user.getIdToken();
  
      // Send the ID token to Xano
      const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_token: idToken }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Response from Xano:", data);
        toast.success(`Welcome, ${user.displayName}!`);
      } else {
        console.error("Error from Xano:", data);
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Facebook Login Error:", error);
      toast.error("Facebook sign-in failed. Try again.");
    }
  };
  
  const sendToXano = async (firebaseUid: string, email: string, idToken: string) => {
    try {
      const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:hRCl8Tp6/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firebase_uid: firebaseUid,
          email: email,
          idToken: idToken
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to register in Xano");
      }
  
      console.log("Response from Xano:", data);
    } catch (error) {
      console.error("Error sending data to Xano:", error);
      toast.error("Failed to save user details in Xano.");
    }
  };
  
  async function onSubmit(event: React.FormEvent) {
  event.preventDefault();

  if (!formData.email || !formData.password || !formData.confirmPassword) {
    toast.error("Please fill in all fields");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  setIsLoading(true);

  try {
    const auth = getAuth(); // Initialize Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const user = userCredential.user;

    if (user) {
      const idToken = await user.getIdToken();  // Get Firebase ID token
      await sendToXano(user.uid, formData.email, idToken);  // Send details to Xano
      toast.success("Registration successful!");
      setFormData({ email: "", password: "", confirmPassword: "" });
    }
  } 

catch (error: unknown) {
  if (error instanceof Error && "code" in error) {
    const authError = error as AuthError;

    if (authError.code === "auth/email-already-in-use") {
      toast.error("This email is already registered. Please log in.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } else {
    toast.error("An unexpected error occurred.");
  }
}

   finally {
    setIsLoading(false);
  }
}

  

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-4">
      <FloatingOrbs />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[504px] space-y-6 rounded-xl bg-black/20 p-6 backdrop-blur-xl"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center space-y-2 text-center"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Register
          </h1>
        </motion.div>

        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <Input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </motion.div>
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
          <span className="text-sm text-white/70">sign up with</span>
          <div className="flex space-x-4">
          <SocialButton
              icon={<GoogleIcon className="h-5 w-5" />}
              onClick={handleGoogleSignIn} // Call the function here
              label="Sign up with Google"
              className="bg-[#4285F4]"
            />
           <SocialButton
              icon={<FacebookIcon className="h-5 w-5" />}
              onClick={handleFacebookLogin}
              label="Sign up with Facebook"
              className="bg-[#3B5998]"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
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

function LoadingSpinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function FloatingOrbs() {
  return (
    <>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute left-20 top-20 h-32 w-32 rounded-full bg-purple-600/30 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -150, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-20 right-20 h-32 w-32 rounded-full bg-green-600/20 blur-3xl"
      />
    </>
  )
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

