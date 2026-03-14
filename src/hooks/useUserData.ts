import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export interface UserData {
  name: string;
  email: string;
  subscriptionTier: string;
  createdAt?: any;
  endDate?: any;
  amountPaid?: string;
  amountDue?: string;
  metrics?: {
    totalTasks: number;
    hoursSaved: number;
    activeWorkflows: number;
    chartData: { day: string; tasks: number }[];
  };
}

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Auth State Changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // If logged in, subscribe to their Firestore Document
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });

        // Cleanup the snapshot listener if auth state changes
        return () => unsubscribeSnapshot();
      } else {
        // Not logged in
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { user, userData, loading };
}
