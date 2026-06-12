"use client";

import { useState, useEffect } from "react";
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  where,
  deleteDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type KickEntry = {
  id: string;
  time: string;
  intensity: number;
  notes: string;
  role: "Mother" | "Father";
  userName: string;
  loved: boolean;
  timestamp: any;
};

export type UserProfile = {
  id: string;
  name: string;
  role: "Mother" | "Father";
  pairId: string | null;
  fcmToken: string | null;
};

export function useKickSync() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [entries, setEntries] = useState<KickEntry[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [hudMessage, setHudMessage] = useState<{ text: string; type: "info" | "success" | "heart" } | null>(null);

  // Initialize or Load local dummy user for scaffolding
  useEffect(() => {
    const localUserId = localStorage.getItem("kicksync_userId") || Math.random().toString(36).substring(7);
    localStorage.setItem("kicksync_userId", localUserId);

    const unsub = onSnapshot(doc(db, "users", localUserId), (docSnap) => {
      if (docSnap.exists()) {
        setUser(docSnap.data() as UserProfile);
      } else {
        const newUser: UserProfile = {
          id: localUserId,
          name: "",
          role: "Mother",
          pairId: null,
          fcmToken: null
        };
        setDoc(doc(db, "users", localUserId), newUser);
        setUser(newUser);
      }
      setIsLive(true);
    }, () => setIsLive(false));

    return () => unsub();
  }, []);

  // Sync entries when paired
  useEffect(() => {
    if (!user?.pairId) {
      setEntries([]);
      return;
    }

    const q = query(
      collection(db, "kicks"),
      where("pairId", "==", user.pairId),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const newEntries = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as KickEntry));
      
      // HUD logic for new kicks or reactions (Simplified version for client-side)
      // In a real app, this would also be triggered by cloud functions / FCM
      setEntries(newEntries);
    });

    return () => unsub();
  }, [user?.pairId]);

  const showHud = (text: string, type: "info" | "success" | "heart" = "info") => {
    setHudMessage({ text, type });
    setTimeout(() => setHudMessage(null), 4000);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.id), updates);
  };

  const generatePairingCode = async () => {
    if (!user) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await setDoc(doc(db, "pairingCodes", code), {
      creatorId: user.id,
      expiresAt: Date.now() + 600000 // 10 mins
    });
    setPairingCode(code);
  };

  const pairWithCode = async (code: string) => {
    if (!user) return;
    const snap = await getDoc(doc(db, "pairingCodes", code));
    if (snap.exists()) {
      const data = snap.data();
      const pairId = [user.id, data.creatorId].sort().join("_");
      
      await updateDoc(doc(db, "users", user.id), { pairId });
      await updateDoc(doc(db, "users", data.creatorId), { pairId });
      await deleteDoc(doc(db, "pairingCodes", code));
      showHud("Successfully paired devices!", "success");
      return true;
    }
    return false;
  };

  const logKick = async (intensity: number, notes: string, date: Date) => {
    if (!user?.pairId) {
      showHud("Please pair devices first", "info");
      return;
    }
    const kick = {
      pairId: user.pairId,
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intensity,
      notes,
      role: user.role,
      userName: user.name || "Partner",
      loved: false,
      timestamp: serverTimestamp()
    };
    await addDoc(collection(db, "kicks"), kick);
    showHud("Kick pushed to matrix ledger.", "success");
  };

  const reactToKick = async (kickId: string) => {
    if (!user) return;
    const kickRef = doc(db, "kicks", kickId);
    const snap = await getDoc(kickRef);
    if (snap.exists()) {
      const currentLoved = snap.data().loved;
      await updateDoc(kickRef, { loved: !currentLoved });
      if (!currentLoved) {
        showHud(`❤️ Husband acknowledged the kick!`, "heart");
      }
    }
  };

  const deleteKick = async (kickId: string) => {
    await deleteDoc(doc(db, "kicks", kickId));
  };

  return {
    user,
    pairingCode,
    entries,
    isLive,
    hudMessage,
    updateProfile,
    generatePairingCode,
    pairWithCode,
    logKick,
    reactToKick,
    deleteKick,
    showHud
  };
}
