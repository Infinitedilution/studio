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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
          <div className="grid gap-4">
            <Label>Background Style</Label>
            <RadioGroup
              value={settings.background}
              onValueChange={(value) => setSetting("background", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dots" id="bg-dots" />
                <Label htmlFor="bg-dots">Dots</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blueprint" id="bg-blueprint" />
                <Label htmlFor="bg-blueprint">Blueprint</Label>
              </div>
               <div className="flex items-center space-x-2">
                <RadioGroupItem value="mesh" id="bg-mesh" />
                <Label htmlFor="bg-mesh">Mesh</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
