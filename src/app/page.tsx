"use client";

import { useState } from "react";
import { useKickSync } from "@/hooks/useKickSync";
import { ConnectivityIndicator } from "@/components/ConnectivityIndicator";
import { HUD } from "@/components/HUD";
import { RecordTab } from "@/components/tabs/RecordTab";
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab";
import { SyncTab } from "@/components/tabs/SyncTab";
import { Footprints, BarChart2, Radio, Heart, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "record" | "analytics" | "sync";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("record");
  const { 
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
    deleteKick 
  } = useKickSync();

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col p-6 gap-8 border-r border-primary/10 glass sticky top-0 h-screen z-40">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Footprints className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-primary tracking-tighter italic leading-none">KickSync</h1>
            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-1">Matrix v2.0</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem 
            active={activeTab === "record"} 
            onClick={() => setActiveTab("record")}
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Recording Deck"
          />
          <SidebarItem 
            active={activeTab === "analytics"} 
            onClick={() => setActiveTab("analytics")}
            icon={<BarChart2 className="w-5 h-5" />}
            label="Pulse Analytics"
          />
          <SidebarItem 
            active={activeTab === "sync"} 
            onClick={() => setActiveTab("sync")}
            icon={<Radio className="w-5 h-5" />}
            label="Network Sync"
          />
        </nav>

        <div className="mt-auto p-4 glass rounded-2xl border-primary/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">
            {user?.name?.[0] || "?"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate">{user?.name || "Initializing..."}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{user?.role || "Node"}</p>
          </div>
          <Settings className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col min-w-0">
        <ConnectivityIndicator isLive={isLive} />
        <HUD message={hudMessage} />

        <header className="md:hidden flex items-center justify-between p-6 glass sticky top-0 z-30 mb-2 border-b border-primary/5">
          <div className="flex items-center gap-2">
            <Footprints className="text-primary w-6 h-6" />
            <h1 className="text-xl font-black text-primary italic tracking-tight">KickSync</h1>
          </div>
          <div className={cn(
            "w-2 h-2 rounded-full",
            isLive ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500"
          )} />
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-12 md:py-8">
          <div className="max-w-4xl mx-auto pb-24 md:pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "record" && <RecordTab onLog={logKick} />}
                {activeTab === "analytics" && (
                  <AnalyticsTab 
                    entries={entries} 
                    onReact={reactToKick} 
                    onDelete={deleteKick} 
                  />
                )}
                {activeTab === "sync" && (
                  <SyncTab 
                    user={user} 
                    pairingCode={pairingCode}
                    onUpdate={updateProfile} 
                    onGenerateCode={generatePairingCode}
                    onPair={pairWithCode} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 p-4 z-40">
          <div className="glass max-w-sm mx-auto h-20 rounded-[2.5rem] flex items-center justify-around px-2 border-white/50 shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
            <MobileNavItem 
              active={activeTab === "record"} 
              onClick={() => setActiveTab("record")}
              icon={<Footprints className="w-6 h-6" />}
              label="Record"
            />
            <MobileNavItem 
              active={activeTab === "analytics"} 
              onClick={() => setActiveTab("analytics")}
              icon={<BarChart2 className="w-6 h-6" />}
              label="Stats"
            />
            <MobileNavItem 
              active={activeTab === "sync"} 
              onClick={() => setActiveTab("sync")}
              icon={<Radio className="w-6 h-6" />}
              label="Sync"
            />
          </div>
        </nav>
      </main>
    </div>
  );
}

function SidebarItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group btn-tactile",
        active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-white/50 hover:text-primary"
      )}
    >
      <div className={cn("transition-transform duration-300", active && "scale-110")}>
        {icon}
      </div>
      <span className="font-bold text-sm tracking-tight">{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
    </button>
  );
}

function MobileNavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300 btn-tactile px-5 py-3 rounded-3xl",
        active ? "text-primary scale-110" : "text-muted-foreground opacity-60"
      )}
    >
      <div className={cn(
        "transition-all duration-300",
        active && "drop-shadow-[0_0_12px_rgba(255,122,144,0.5)]"
      )}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.15em]">{label}</span>
    </button>
  );
}