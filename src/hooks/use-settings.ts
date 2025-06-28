"use client";

import { useState, useEffect, createContext, useContext, createElement } from 'react';
import type { Settings } from '@/lib/types';
import { hexToHsl } from '@/lib/utils';

const SETTINGS_KEY = 'orbital-dock-settings';

const defaultSettings: Settings = {
  iconSize: 80,
  dockIconSize: 64,
  showBackgroundPattern: true,
  primaryColor: '#3b82f6',
  accentColor: '#9333ea',
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
    }
  }, [settings, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const styleElementId = 'custom-theme-colors';
    let styleElement = document.getElementById(styleElementId) as HTMLStyleElement | null;
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleElementId;
        document.head.appendChild(styleElement);
    }

    const primaryHsl = hexToHsl(settings.primaryColor);
    const accentHsl = hexToHsl(settings.accentColor);
    
    // Only apply overrides if colors are valid hex
    if (primaryHsl || accentHsl) {
      let css = '.dark {';
      if (primaryHsl) {
          css += `--primary: ${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%;`;
          css += `--ring: ${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%;`;
      }
      if (accentHsl) {
          css += `--accent: ${accentHsl.h} ${accentHsl.s}% ${accentHsl.l}%;`;
      }
      css += '}';
      styleElement.innerHTML = css;
    }

  }, [settings.primaryColor, settings.accentColor, isMounted]);

  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const value = { settings, setSetting };

  return createElement(SettingsContext.Provider, { value }, children);
};
