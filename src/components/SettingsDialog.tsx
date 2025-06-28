"use client";

import { useSettings } from "@/hooks/use-settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "./ui/separator";
import { ConnectWallet } from "./ConnectWallet";

export function SettingsDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const { settings, setSetting } = useSettings();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Settings</DialogTitle>
          <DialogDescription>
            Customize your app experience. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
            <Label htmlFor="icon-size">Icon Size: {settings.iconSize}px</Label>
            <Slider
              id="icon-size"
              min={48}
              max={128}
              step={8}
              value={[settings.iconSize]}
              onValueChange={(value) => setSetting("iconSize", value[0])}
            />
          </div>
          <Separator />
          <div className="grid gap-4">
            <Label>Wallet</Label>
            <ConnectWallet />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
