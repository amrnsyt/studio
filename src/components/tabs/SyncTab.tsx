"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Share2, User, Key, Check, Network, BellRing } from "lucide-react";
import { UserProfile } from "@/hooks/useKickSync";
import { motion } from "framer-motion";

export function SyncTab({ 
  user, 
  pairingCode,
  onUpdate, 
  onGenerateCode, 
  onPair 
}: { 
  user: UserProfile | null, 
  pairingCode: string | null,
  onUpdate: (updates: Partial<UserProfile>) => void,
  onGenerateCode: () => void,
  onPair: (code: string) => Promise<boolean>
}) {
  const [code, setCode] = useState("");
  const [isPairing, setIsPairing] = useState(false);

  const handlePair = async () => {
    setIsPairing(true);
    const success = await onPair(code);
    setIsPairing(false);
    if (success) setCode("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="w-full space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground/80">Network Sync</h2>
        <p className="text-sm text-muted-foreground">Manage your connection nodes and profile settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass p-8 space-y-8 border-white/50">
          <div className="flex items-center gap-3 text-primary">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl tracking-tight">Your Node Profile</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Network Alias</Label>
              <Input 
                value={user?.name || ""} 
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="Enter your name"
                className="bg-white/40 border-none h-14 rounded-2xl px-5 text-sm font-bold"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Designated Role</Label>
              <Select 
                value={user?.role} 
                onValueChange={(val: any) => onUpdate({ role: val })}
              >
                <SelectTrigger className="bg-white/40 border-none h-14 rounded-2xl px-5 text-sm font-bold">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="glass border-white/40 rounded-2xl">
                  <SelectItem value="Mother" className="rounded-xl font-bold">Mother (Primary Input)</SelectItem>
                  <SelectItem value="Father" className="rounded-xl font-bold">Father (Receiver Node)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="glass p-8 space-y-8 border-white/50">
          <div className="flex items-center gap-3 text-secondary">
            <div className="bg-secondary/10 p-3 rounded-2xl">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl tracking-tight">Secure Linkage</h3>
          </div>

          {user?.pairId ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500/10 p-8 rounded-3xl flex flex-col items-center gap-4 text-green-700 border border-green-500/20"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/20">
                <Check className="w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">Node Sync Active</p>
                <p className="text-xs font-medium opacity-70">Encrypted peer-to-peer connection established.</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Host Mode (Primary)</Label>
                {pairingCode ? (
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-secondary/10 p-8 rounded-[2rem] text-center border border-secondary/20 shadow-inner"
                  >
                    <div className="text-5xl font-black tracking-[0.3em] text-secondary mb-3 italic">{pairingCode}</div>
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest">Expires in 10 minutes</p>
                  </motion.div>
                ) : (
                  <Button onClick={onGenerateCode} className="w-full h-16 rounded-2xl bg-secondary hover:bg-secondary/90 btn-tactile font-black text-base shadow-lg shadow-secondary/10">
                    <Key className="w-5 h-5 mr-3" />
                    BROADCAST SYNC CODE
                  </Button>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted/50" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-transparent px-4 text-muted-foreground font-black tracking-widest">Matrix Divider</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Receiver Mode (Peer)</Label>
                <div className="flex gap-3">
                  <Input 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="bg-white/40 border-none h-16 rounded-2xl text-center text-2xl font-black tracking-[0.3em] italic px-2"
                  />
                  <Button 
                    onClick={handlePair} 
                    disabled={code.length !== 6 || isPairing}
                    className="h-16 w-16 shrink-0 rounded-2xl btn-tactile bg-foreground hover:bg-foreground/90"
                  >
                    <Share2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="glass p-8 border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-secondary/10 p-3 rounded-2xl">
              <BellRing className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Quantum Notifications</h3>
              <p className="text-xs text-muted-foreground font-medium">Get instant feedback when your partner logs a kick.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-2xl h-12 px-8 border-secondary/30 text-secondary hover:bg-secondary/10 font-bold">ENABLE</Button>
        </div>
      </Card>
    </div>
  );
}