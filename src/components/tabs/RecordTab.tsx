"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Footprints, Clock, Send, MessageSquareHeart } from "lucide-react";
import { motion } from "framer-motion";

export function RecordTab({ onLog }: { onLog: (intensity: number, notes: string, date: Date) => void }) {
  const [time, setTime] = useState("");
  const [intensity, setIntensity] = useState([3]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickLog = () => {
    onLog(intensity[0], notes, new Date());
    setNotes("");
  };

  return (
    <div className="flex flex-col items-center gap-10 md:gap-14 animate-in fade-in slide-in-from-bottom-4">
      <div className="w-full space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground/80">Recording Node</h2>
        <p className="text-sm text-muted-foreground">Capture real-time fetal movement to the sync matrix.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 w-full">
        <div className="relative group shrink-0">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-primary/25 rounded-full blur-[60px] group-hover:bg-primary/30 transition-colors" 
          />
          <button
            onClick={handleQuickLog}
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary via-primary to-secondary flex flex-col items-center justify-center gap-4 text-white btn-tactile pulse-kick border-[12px] border-white/30 shadow-2xl z-10"
          >
            <Footprints className="w-20 h-20 md:w-24 md:h-24 drop-shadow-lg" />
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-black tracking-tighter italic block">LOG KICK</span>
              <div className="flex items-center justify-center gap-1.5 opacity-80 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-bold tabular-nums tracking-widest">{time || "--:--"}</span>
              </div>
            </div>
          </button>
        </div>

        <Card className="glass w-full p-8 space-y-8 border-white/50">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Movement Intensity</Label>
                <p className="text-sm font-medium text-foreground/60">How strong was it?</p>
              </div>
              <span className="text-4xl font-black text-primary italic leading-none">{intensity[0]}</span>
            </div>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={5}
              min={1}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60 uppercase">
              <span>Flutter</span>
              <span>Strong</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="w-4 h-4 text-secondary" />
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Transmission Notes</Label>
            </div>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. Rolling, strong kick, hiccups..."
              className="bg-white/40 border-none rounded-2xl focus-visible:ring-primary h-14 text-sm font-medium"
            />
          </div>

          <Button 
            onClick={handleQuickLog}
            className="w-full h-16 rounded-2xl font-black text-lg btn-tactile shadow-xl shadow-primary/10 bg-primary hover:bg-primary/90"
          >
            <Send className="w-5 h-5 mr-3" />
            PUSH TO LEDGER
          </Button>
        </Card>
      </div>
    </div>
  );
}