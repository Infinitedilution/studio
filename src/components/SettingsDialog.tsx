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
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">{settings.primaryColor}</span>
                  <input
                      id="primary-color"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSetting("primaryColor", e.target.value)}
                      className="h-8 w-10 p-1 bg-transparent border rounded-md cursor-pointer"
                  />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">{settings.accentColor}</span>
                  <input
                      id="accent-color"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSetting("accentColor", e.target.value)}
                      className="h-8 w-10 p-1 bg-transparent border rounded-md cursor-pointer"
                  />
              </div>
            </div>
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
