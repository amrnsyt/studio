"use client";

import { cn } from "@/lib/utils";

export function ConnectivityIndicator({ isLive }: { isLive: boolean }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2 glass px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
      <div className={cn(
        "w-1.5 h-1.5 rounded-full animate-pulse",
        isLive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"
      )} />
      <span className={cn(isLive ? "text-green-600" : "text-red-600 uppercase")}>
        {isLive ? "SYSTEM LIVE" : "OFFLINE NODE"}
      </span>
    </div>
  );
}
