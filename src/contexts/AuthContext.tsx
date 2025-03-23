"use client"; // ✅ Mark as a client component

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/auth/register-form/firebase"; // ✅ Import from firebaseConfig
import { User, onAuthStateChanged } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean; // ✅ Add loading property
  }  

  const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // ✅ Initialize loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // ✅ Set loading to false when Firebase checks authentication
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
