"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Footprints, Clock, Send } from "lucide-react";

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
    <div className="flex flex-col items-center gap-8 pb-32 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-primary font-bold">
          <Clock className="w-4 h-4" />
          <span className="text-4xl tabular-nums tracking-tight">{time || "--:--"}</span>
        </div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Real-time Matrix</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-active:scale-95 transition-transform" />
        <button
          onClick={handleQuickLog}
          className="relative w-56 h-56 rounded-full bg-gradient-to-br from-primary to-[#FF9BAE] flex flex-col items-center justify-center gap-3 text-white btn-tactile pulse-kick border-[8px] border-white/20 shadow-2xl"
        >
          <Footprints className="w-16 h-16" />
          <span className="text-xl font-bold tracking-tight">LOG KICK</span>
        </button>
      </div>

      <Card className="glass w-full p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold text-muted-foreground">INTENSITY</Label>
            <span className="text-lg font-bold text-primary">{intensity[0]}</span>
          </div>
          <Slider
            value={intensity}
            onValueChange={setIntensity}
            max={5}
            min={1}
            step={1}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-muted-foreground">NOTES (OPTIONAL)</Label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Fluttering, strong kick..."
            className="bg-white/50 border-none rounded-xl focus-visible:ring-primary h-12"
          />
        </div>

        <Button 
          onClick={handleQuickLog}
          className="w-full h-14 rounded-xl font-bold text-lg btn-tactile shadow-lg shadow-primary/20"
        >
          <Send className="w-5 h-5 mr-2" />
          SAVE TO LEDGER
        </Button>
      </Card>
    </div>
  );
}
