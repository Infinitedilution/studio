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
import { hexToHsl, hslToHex } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function SettingsDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const { settings, setSetting } = useSettings();

  const handleGradientChange = (colorKey: 'gradientFrom' | 'gradientTo') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const hsl = hexToHsl(e.target.value);
    if (hsl) {
      setSetting(colorKey, `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    }
  };
  
  const getHexFromHslString = (hslString?: string): string => {
    if (!hslString) return '#000000';
    const parts = hslString.replace(/%/g, '').split(' ').map(Number);
    if (parts.length === 3) {
        const [h, s, l] = parts;
        return hslToHex(h, s, l);
    }
    return '#000000';
  }

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
              className="flex flex-wrap items-center gap-x-4 gap-y-2"
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
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gradient" id="bg-gradient" />
                <Label htmlFor="bg-gradient">Gradient</Label>
              </div>
            </RadioGroup>
          </div>
          
          {settings.background === 'gradient' && (
            <div className="grid gap-4 pt-2 animate-in fade-in duration-300">
              <Separator />
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="gradient-from">Gradient Start</Label>
                  <input
                      id="gradient-from"
                      type="color"
                      className="p-1 h-8 w-14 rounded-md cursor-pointer border border-input bg-background"
                      value={getHexFromHslString(settings.gradientFrom)}
                      onChange={handleGradientChange('gradientFrom')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="gradient-to">Gradient End</Label>
                  <input
                      id="gradient-to"
                      type="color"
                      className="p-1 h-8 w-14 rounded-md cursor-pointer border border-input bg-background"
                      value={getHexFromHslString(settings.gradientTo)}
                      onChange={handleGradientChange('gradientTo')}
                  />
                </div>
              </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
