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
import { Button } from "./ui/button";
import { Sparkles, Wand2 } from "lucide-react";
import { Switch } from "./ui/switch";

export function SettingsDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const { settings, setSetting } = useSettings();

  const handleColorChange = (colorKey: 'gradientFrom' | 'gradientTo' | 'patternColor') => (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const randomizeSettings = () => {
    const backgrounds = ['dots', 'blueprint', 'mesh', 'gradient'];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setSetting('background', randomBg);
    
    const randomH1 = Math.floor(Math.random() * 360);
    const randomS1 = Math.floor(Math.random() * 50) + 50;
    const randomL1 = Math.floor(Math.random() * 40) + 10;
    setSetting('gradientFrom', `${randomH1} ${randomS1}% ${randomL1}%`);

    const randomH2 = (randomH1 + Math.floor(Math.random() * 120) + 30) % 360;
    const randomS2 = Math.floor(Math.random() * 50) + 50;
    const randomL2 = Math.floor(Math.random() * 40) + 10;
    setSetting('gradientTo', `${randomH2} ${randomS2}% ${randomL2}%`);
    
    setSetting('gradientType', Math.random() > 0.5 ? 'linear' : 'radial');

    const randomH3 = Math.floor(Math.random() * 360);
    const randomS3 = Math.floor(Math.random() * 50) + 50;
    const randomL3 = Math.floor(Math.random() * 40) + 40;
    setSetting('patternColor', `${randomH3} ${randomS3}% ${randomL3}%`);
    setSetting('patternOpacity', parseFloat((Math.random() * 0.15 + 0.05).toFixed(2))); // 0.05 - 0.20
    setSetting('patternGlow', Math.random() > 0.5);
  };


  const isPatternSettingsVisible = settings.background === 'dots' || settings.background === 'blueprint';

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
          <div className="flex justify-between items-center">
             <Label className="font-bold text-lg">Theme</Label>
             <Button onClick={randomizeSettings} variant="ghost" size="sm">
                <Wand2 className="mr-2" /> Randomize
            </Button>
          </div>
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
                <Label className="font-semibold">Gradient Options</Label>
                 <RadioGroup
                    value={settings.gradientType}
                    onValueChange={(value) => setSetting("gradientType", value as 'linear' | 'radial')}
                    className="flex items-center gap-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="linear" id="grad-linear" />
                      <Label htmlFor="grad-linear">Linear</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="radial" id="grad-radial" />
                      <Label htmlFor="grad-radial">Radial</Label>
                    </div>
                  </RadioGroup>
                <div className="flex items-center justify-between">
                  <Label htmlFor="gradient-from">Start Color</Label>
                  <input
                      id="gradient-from"
                      type="color"
                      className="p-1 h-8 w-14 rounded-md cursor-pointer border border-input bg-background"
                      value={getHexFromHslString(settings.gradientFrom)}
                      onChange={handleColorChange('gradientFrom')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="gradient-to">End Color</Label>
                  <input
                      id="gradient-to"
                      type="color"
                      className="p-1 h-8 w-14 rounded-md cursor-pointer border border-input bg-background"
                      value={getHexFromHslString(settings.gradientTo)}
                      onChange={handleColorChange('gradientTo')}
                  />
                </div>
              </div>
          )}

          {isPatternSettingsVisible && (
            <div className="grid gap-4 pt-2 animate-in fade-in duration-300">
               <Separator />
               <Label className="font-semibold">Pattern Options</Label>
                <div className="flex items-center justify-between">
                    <Label htmlFor="pattern-color">Color</Label>
                    <input
                        id="pattern-color"
                        type="color"
                        className="p-1 h-8 w-14 rounded-md cursor-pointer border border-input bg-background"
                        value={getHexFromHslString(settings.patternColor)}
                        onChange={handleColorChange('patternColor')}
                    />
                </div>
                <div className="grid gap-2">
                   <Label htmlFor="pattern-opacity">Opacity: {Math.round(settings.patternOpacity * 100)}%</Label>
                   <Slider
                    id="pattern-opacity"
                    min={0.01}
                    max={0.5}
                    step={0.01}
                    value={[settings.patternOpacity]}
                    onValueChange={(value) => setSetting("patternOpacity", value[0])}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pattern-glow" className="flex items-center gap-2">
                    <Sparkles className="text-primary" /> Glow Effect
                  </Label>
                  <Switch 
                    id="pattern-glow"
                    checked={settings.patternGlow}
                    onCheckedChange={(checked) => setSetting("patternGlow", checked)}
                  />
                </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
