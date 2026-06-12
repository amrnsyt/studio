"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Share2, User, Key, Check } from "lucide-react";
import { UserProfile } from "@/hooks/useKickSync";

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
    <div className="space-y-6 pb-32 animate-in fade-in slide-in-from-bottom-4">
      <Card className="glass p-6 space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <div className="bg-primary/10 p-2 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">Your Profile</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase">Display Name</Label>
            <Input 
              value={user?.name || ""} 
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter your name"
              className="bg-white/50 border-none h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase">Your Role</Label>
            <Select 
              value={user?.role} 
              onValueChange={(val: any) => onUpdate({ role: val })}
            >
              <SelectTrigger className="bg-white/50 border-none h-12 rounded-xl">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="Mother">Mother (Primary Input)</SelectItem>
                <SelectItem value="Father">Father (Receiver Node)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="glass p-6 space-y-6">
        <div className="flex items-center gap-3 text-secondary">
          <div className="bg-secondary/10 p-2 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">Secure Pairing</h3>
        </div>

        {user?.pairId ? (
          <div className="bg-green-500/10 p-4 rounded-xl flex items-center gap-3 text-green-700">
            <Check className="w-5 h-5" />
            <div className="text-sm font-medium">Successfully linked to partner node</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Generate code (Mom)</Label>
              {pairingCode ? (
                <div className="bg-secondary/10 p-6 rounded-2xl text-center">
                  <div className="text-4xl font-bold tracking-[0.5em] text-secondary mb-2">{pairingCode}</div>
                  <p className="text-[10px] text-secondary font-bold uppercase">Expires in 10 minutes</p>
                </div>
              ) : (
                <Button onClick={onGenerateCode} className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 btn-tactile">
                  <Key className="w-4 h-4 mr-2" />
                  GENERATE 6-DIGIT CODE
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground font-bold">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Enter Code (Dad)</Label>
              <div className="flex gap-2">
                <Input 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="bg-white/50 border-none h-12 rounded-xl text-center text-xl font-bold tracking-widest"
                />
                <Button 
                  onClick={handlePair} 
                  disabled={code.length !== 6 || isPairing}
                  className="h-12 w-12 rounded-xl btn-tactile"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="glass p-6 space-y-4">
        <h3 className="font-bold text-sm text-muted-foreground uppercase">System Permissions</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Push Notifications</div>
            <div className="text-[10px] text-muted-foreground">Alert when partner logs a kick</div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl border-secondary text-secondary">Enable</Button>
        </div>
      </Card>
    </div>
  );
}
