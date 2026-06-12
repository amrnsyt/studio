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
}"use client";

import { useState } from "react";
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Zap, 
  Database, 
  LayoutDashboard,
  Moon,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isAutomating, setIsAutomating] = useState(false);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-4 md:p-8 font-sans selection:bg-primary/30">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sync Task & Automation Center</h1>
              <p className="text-sm text-zinc-500">Workspace Management v2.4</p>
            </div>
          </div>
          <button className="self-start md:self-center p-2 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-colors">
            <Moon className="w-4 h-4 text-zinc-400" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Task Area */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={addTask} className="relative group">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Initialize new task protocol..."
                className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-4 pl-5 pr-32 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </form>

            <div className="space-y-3">
              {tasks.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-zinc-500 text-sm">No active tasks in current buffer.</p>
                </div>
              )}
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                    task.completed ? "bg-zinc-900/30 border-white/5" : "bg-zinc-900 border-white/10 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600 group-hover:text-primary/50" />
                    )}
                    <span className={cn(
                      "text-sm font-medium transition-all",
                      task.completed ? "text-zinc-600 line-through" : "text-zinc-200"
                    )}>
                      {task.text}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setTasks(tasks.filter(t => t.id !== task.id)); }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Sidebar */}
          <div className="space-y-6">
            <section className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Background Automation</h2>
              </div>
              
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">Nightly Archive Script</span>
                  <button 
                    onClick={() => setIsAutomating(!isAutomating)}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors duration-300",
                      isAutomating ? "bg-primary" : "bg-zinc-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                      isAutomating ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", isAutomating ? "bg-green-500 animate-pulse" : "bg-zinc-600")} />
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Status: {isAutomating ? "Running Protocol" : "Idle"}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 leading-relaxed px-1">
                Scripts handle automatic clean-up of completed nodes every 24 hours at 03:00 UTC.
              </div>
            </section>

            {/* Sync Badge */}
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900/50 border border-white/5 rounded-full">
              <Database className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400">
                Firestore Sync: <span className="text-green-500">Connected</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
