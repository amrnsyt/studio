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
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4"
        >
          <div className="glass px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl border-primary/20">
            {message.type === "heart" && <Heart className="text-primary fill-primary w-5 h-5 animate-pulse" />}
            {message.type === "success" && <CheckCircle2 className="text-green-500 w-5 h-5" />}
            {message.type === "info" && <Bell className="text-secondary w-5 h-5" />}
            <span className="text-sm font-medium text-foreground">{message.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
