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
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Shuffle } from "lucide-react";
import { PRESET_GRADIENTS } from "@/lib/gradients";

export function SettingsDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const { settings, setSetting } = useSettings();

  const handleRandomGradient = () => {
    const randomIndex = Math.floor(Math.random() * PRESET_GRADIENTS.length);
    setSetting("gradientIndex", randomIndex);
  };

  const currentGradientName = PRESET_GRADIENTS[settings.gradientIndex]?.name || 'Default';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Settings</DialogTitle>
          <DialogDescription>
            Customize your app experience. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid gap-4">
            <h3 className="font-medium text-sm text-muted-foreground">Appearance</h3>
            <div className="grid gap-4">
              <Label htmlFor="icon-size">Grid Icon Size: {settings.iconSize}px</Label>
              <Slider
                id="icon-size"
                min={48}
                max={128}
                step={8}
                value={[settings.iconSize]}
                onValueChange={(value) => setSetting("iconSize", value[0])}
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="dock-icon-size">Dock Icon Size: {settings.dockIconSize}px</Label>
              <Slider
                id="dock-icon-size"
                min={32}
                max={96}
                step={4}
                value={[settings.dockIconSize]}
                onValueChange={(value) => setSetting("dockIconSize", value[0])}
              />
            </div>
          </div>
          <Separator />
           <div className="grid gap-4">
            <h3 className="font-medium text-sm text-muted-foreground">Theme</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-gradient" className="pr-4">Use Custom Gradient</Label>
              <Switch
                  id="custom-gradient"
                  checked={settings.useCustomGradient}
                  onCheckedChange={(value) => setSetting("useCustomGradient", value)}
              />
            </div>

            {settings.useCustomGradient && (
              <div className="grid gap-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gradient-slider">Gradient: {currentGradientName}</Label>
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRandomGradient}>
                      <Shuffle className="h-4 w-4" />
                      <span className="sr-only">Randomize Gradient</span>
                    </Button>
                </div>
                <Slider
                  id="gradient-slider"
                  min={0}
                  max={PRESET_GRADIENTS.length - 1}
                  step={1}
                  value={[settings.gradientIndex]}
                  onValueChange={(value) => setSetting("gradientIndex", value[0])}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="background-pattern" className="pr-4">Show Background Pattern</Label>
              <Switch
                  id="background-pattern"
                  checked={settings.showBackgroundPattern}
                  onCheckedChange={(value) => setSetting("showBackgroundPattern", value)}
              />
            </div>
           </div>
          <Separator />
          <div className="grid gap-4">
            <h3 className="font-medium text-sm text-muted-foreground">Account</h3>
            <ConnectWallet />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
