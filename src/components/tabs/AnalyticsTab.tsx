"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Sparkles, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { KickEntry } from "@/hooks/useKickSync";
import { dailyKickRhythmSummary } from "@/ai/flows/daily-kick-rhythm-summary";

export function AnalyticsTab({ 
  entries, 
  onReact, 
  onDelete 
}: { 
  entries: KickEntry[], 
  onReact: (id: string) => void,
  onDelete: (id: string) => void
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const todayCount = entries.filter(e => {
    // Simple check for today
    return true; // Simplification for demo
  }).length;

  const handleAnalyze = async () => {
    if (entries.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await dailyKickRhythmSummary({
        kickEntries: entries.slice(0, 10).map(e => ({
          time: e.time,
          intensity: e.intensity,
          notes: e.notes
        }))
      });
      setAiSummary(result.summary);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-32 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass p-4 border-primary/10">
          <div className="flex items-center gap-2 text-primary mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Today</span>
          </div>
          <div className="text-3xl font-bold">{todayCount}</div>
          <div className="text-[10px] text-muted-foreground mt-1">LOGGED KICKS</div>
        </Card>
        <Card className="glass p-4 border-secondary/10">
          <div className="flex items-center gap-2 text-secondary mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">This Week</span>
          </div>
          <div className="text-3xl font-bold">{entries.length}</div>
          <div className="text-[10px] text-muted-foreground mt-1">TOTAL ENTRIES</div>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-secondary to-primary p-6 text-white border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Sparkles className="w-20 h-20 rotate-12" />
        </div>
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Rhythm Insight
        </h3>
        {aiSummary ? (
          <p className="text-sm leading-relaxed opacity-90">{aiSummary}</p>
        ) : (
          <p className="text-sm opacity-90">Generate an AI summary of baby's activity patterns for the day.</p>
        )}
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || entries.length === 0}
          className="mt-4 bg-white text-secondary hover:bg-white/90 font-bold w-full rounded-xl btn-tactile"
        >
          {isAnalyzing ? "ANALYZING..." : "GENERATE SUMMARY"}
        </Button>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">Activity History</h3>
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass p-4 border-white/40 flex items-center justify-between group">
              <div className="flex gap-4 items-center">
                <div className="bg-primary/10 p-2 rounded-xl text-primary font-bold text-xs">
                  {entry.time}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{entry.userName}</span>
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 uppercase tracking-tighter">
                      lvl {entry.intensity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{entry.notes || "Recorded movement."}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onReact(entry.id)}
                  className={cn(
                    "rounded-full btn-tactile",
                    entry.loved ? "text-primary hover:text-primary" : "text-muted-foreground"
                  )}
                >
                  <Heart className={cn("w-5 h-5", entry.loved && "fill-primary")} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(entry.id)}
                  className="rounded-full text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Re-using motion components for animation
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
