"use client";

import { useState } from "react";
import { useKickSync } from "@/hooks/useKickSync";
import { ConnectivityIndicator } from "@/components/ConnectivityIndicator";
import { HUD } from "@/components/HUD";
import { RecordTab } from "@/components/tabs/RecordTab";
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab";
import { SyncTab } from "@/components/tabs/SyncTab";
import { Footprints, BarChart2, Radio, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <main className="relative min-h-screen pt-20 px-6 max-w-md mx-auto">
      <ConnectivityIndicator isLive={isLive} />
      <HUD message={hudMessage} />

      <header className="mb-8 animate-in fade-in slide-in-from-top-4">
        <h1 className="text-3xl font-black text-primary tracking-tighter italic">KickSync</h1>
        <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Collaborative Push Matrix</p>
      </header>

      <div className="h-[calc(100vh-280px)] overflow-y-auto pr-1">
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
      </div>

      <nav className="fixed bottom-0 left-0 right-0 p-6 z-[90]">
        <div className="glass max-w-sm mx-auto h-20 rounded-[2rem] flex items-center justify-around px-4 border-white/40 shadow-2xl">
          <NavItem 
            active={activeTab === "record"} 
            onClick={() => setActiveTab("record")}
            icon={<Footprints className="w-6 h-6" />}
            label="Record"
          />
          <NavItem 
            active={activeTab === "analytics"} 
            onClick={() => setActiveTab("analytics")}
            icon={<BarChart2 className="w-6 h-6" />}
            label="Stats"
          />
          <NavItem 
            active={activeTab === "sync"} 
            onClick={() => setActiveTab("sync")}
            icon={<Radio className="w-6 h-6" />}
            label="Sync"
          />
        </div>
      </nav>
    </main>
  );
}

function NavItem({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean, 
  onClick: () => void, 
  icon: React.ReactNode,
  label: string 
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300 btn-tactile px-4 py-2 rounded-2xl",
        active ? "text-primary scale-110" : "text-muted-foreground opacity-60 hover:opacity-100"
      )}
    >
      <div className={cn(
        "transition-colors duration-300",
        active && "drop-shadow-[0_0_8px_rgba(255,122,144,0.4)]"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
