"use client";

import { useState, useEffect, useCallback, createContext, useContext, createElement } from 'react';
import type { Settings } from '@/lib/types';

const SETTINGS_KEY = 'orbital-dock-settings';

const defaultSettings: Settings = {
  iconSize: 80,
  background: 'dots',
  gradientFrom: '222 84% 5%', // Default dark theme background
  gradientTo: '240 4% 12%',   // Default dark theme card background
  gradientType: 'linear',
  patternColor: '212 87% 60%', // Default accent
  patternOpacity: 0.1,
  patternGlow: false,
};

interface SettingsContextType {
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        // Merge stored settings with defaults to ensure all keys are present
        const parsed = JSON.parse(storedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      
      const body = document.body;
      // Clear all dynamic background/pattern classes and styles
      body.className = body.className.split(' ').filter(c => !c.startsWith('bg-') && c !== 'glow').join(' ');
      body.style.backgroundImage = '';
      body.style.boxShadow = '';
      body.style.backgroundColor = `hsl(var(--background))`;

      // Set pattern variables for dots/blueprint to use
      body.style.setProperty('--pattern-color', settings.patternColor);
      body.style.setProperty('--pattern-opacity', String(settings.patternOpacity));

      if (settings.background === 'gradient') {
          const fromColor = `hsl(${settings.gradientFrom})`;
          const toColor = `hsl(${settings.gradientTo})`;
          if (settings.gradientType === 'radial') {
            body.style.backgroundImage = `radial-gradient(circle, ${fromColor}, ${toColor})`;
          } else {
            body.style.backgroundImage = `linear-gradient(to bottom right, ${fromColor}, ${toColor})`;
          }
      } else if (['dots', 'blueprint', 'mesh'].includes(settings.background)) {
          body.classList.add(`bg-${settings.background}`);
          if (settings.patternGlow && (settings.background === 'dots' || settings.background === 'blueprint')) {
              body.classList.add('glow');
          }
      }
    }
  }, [settings, isMounted]);

  const setSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const value = { settings, setSetting };

  return createElement(SettingsContext.Provider, { value }, children);
};
