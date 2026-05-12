import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { AppUser } from "../types";

interface AuthContextValue {
  user: AppUser;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const provider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser>({ state: "loading" });

  useEffect(() => {
    // URLにゲストキーが含まれているか確認
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get("key");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ state: "admin", uid: firebaseUser.uid, email: firebaseUser.email ?? undefined });
        return;
      }

      // Googleログインなし → ゲストキーを確認
      if (urlKey) {
        const snap = await getDoc(doc(db, "config", "guestKey"));
        if (snap.exists() && snap.data().key === urlKey) {
          setUser({ state: "guest" });
          return;
        }
      }

      setUser({ state: "unauthorized" });
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider);
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser({ state: "unauthorized" });
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
