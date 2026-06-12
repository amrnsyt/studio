"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, TrendingUp, Calendar as CalendarIcon, Activity } from "lucide-react";
import { KickEntry } from "@/hooks/useKickSync";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function AnalyticsTab({ 
  entries, 
  onReact, 
  onDelete 
}: { 
  entries: KickEntry[], 
  onReact: (id: string) => void,
  onDelete: (id: string) => void
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = entries.slice(0, 10).reverse().map(e => ({
    time: e.time,
    intensity: e.intensity
  }));

  const todayCount = entries.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="w-full space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground/80">Pulse Analytics</h2>
        <p className="text-sm text-muted-foreground">Historical movement data across the paired node network.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard 
          icon={<TrendingUp className="w-4 h-4" />}
          title="Daily Count"
          value={todayCount}
          label="LOGGED KICKS"
          color="text-primary"
          borderColor="border-primary/20"
        />
        <StatsCard 
          icon={<CalendarIcon className="w-4 h-4" />}
          title="Total Ledger"
          value={entries.length}
          label="SYNCED ENTRIES"
          color="text-secondary"
          borderColor="border-secondary/20"
        />
        <StatsCard 
          icon={<Activity className="w-4 h-4" />}
          title="Avg Intensity"
          value={entries.length ? (entries.reduce((acc, curr) => acc + curr.intensity, 0) / entries.length).toFixed(1) : "0"}
          label="FORCE SCALE"
          color="text-green-500"
          borderColor="border-green-500/20"
        />
      </div>

      <Card className="glass p-6 md:p-8 border-white/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-primary">
            <div className="bg-primary/10 p-2 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Activity Waveform</h3>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary">LIVE SYNC</Badge>
        </div>

        <div className="h-[250px] w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7A90" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF7A90" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FF7A9020" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                <YAxis hide domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#FF7A90' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#FF7A90" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorIntensity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5 rounded-2xl animate-pulse">
              <Activity className="w-8 h-8 text-primary/20" />
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Transmission Log</h3>
          <span className="text-[10px] font-bold text-muted-foreground/60">{entries.length} RECORDS FOUND</span>
        </div>
        
        {entries.length === 0 ? (
          <div className="text-center py-20 glass rounded-[2rem] border-dashed border-2 border-muted">
            <p className="text-sm text-muted-foreground font-medium">Matrix ledger is empty.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="glass p-5 border-white/50 flex items-center justify-between group transition-all hover:translate-x-1">
                  <div className="flex gap-5 items-center">
                    <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-primary font-black text-xs italic shadow-inner">
                      {entry.time}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-base">{entry.userName}</span>
                        <Badge className="bg-secondary text-[9px] px-2 py-0 h-4.5 uppercase font-black tracking-widest">
                          LVL {entry.intensity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground/80 mt-1 font-medium">{entry.notes || "Standard movement detected."}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReact(entry.id)}
                      className={cn(
                        "rounded-full w-12 h-12 btn-tactile flex items-center justify-center transition-all",
                        entry.loved ? "text-primary bg-primary/5" : "text-muted-foreground/40 hover:text-primary"
                      )}
                    >
                      <Heart className={cn("w-6 h-6 transition-all", entry.loved && "fill-primary scale-110")} />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="rounded-full w-10 h-10 text-muted-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ icon, title, value, label, color, borderColor }: { icon: any, title: string, value: string | number, label: string, color: string, borderColor: string }) {
  return (
    <Card className={cn("glass p-6 border-white/50 relative overflow-hidden group", borderColor)}>
      <div className={cn("flex items-center gap-2 mb-3", color)}>
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
      </div>
      <div className="text-4xl font-black italic tracking-tighter">{value}</div>
      <div className="text-[9px] text-muted-foreground/60 font-bold mt-2 tracking-widest">{label}</div>
      <div className={cn("absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500", color)}>
        <Activity className="w-24 h-24" />
      </div>
    </Card>
  );
}
