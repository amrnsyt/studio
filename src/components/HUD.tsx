"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bell, CheckCircle2 } from "lucide-react";

type HUDProps = {
  message: { text: string; type: "info" | "success" | "heart" } | null;
};

export function HUD({ message }: HUDProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 32, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
        >
          <div className="glass px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-primary/20 pointer-events-auto">
            <div className="bg-white/50 p-2 rounded-xl">
              {message.type === "heart" && <Heart className="text-primary fill-primary w-5 h-5 animate-pulse" />}
              {message.type === "success" && <CheckCircle2 className="text-green-500 w-5 h-5" />}
              {message.type === "info" && <Bell className="text-secondary w-5 h-5" />}
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">{message.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}