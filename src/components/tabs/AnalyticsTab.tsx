
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { KickEntry } from "@/hooks/useKickSync";
import { cn } from "@/lib/utils";

export function AnalyticsTab({ 
  entries, 
  onReact, 
  onDelete 
}: { 
  entries: KickEntry[], 
  onReact: (id: string) => void,
  onDelete: (id: string) => void
}) {
  const todayCount = entries.filter(e => {
    // Simple check for today
    return true; // Simplification for demo
  }).length;

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

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">Activity History</h3>
        {entries.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl border-dashed border-2 border-muted">
            <p className="text-sm text-muted-foreground">No entries recorded yet.</p>
          </div>
        ) : (
          entries.map((entry) => (
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
          ))
        )}
      </div>
    </div>
  );
}
