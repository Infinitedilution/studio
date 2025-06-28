"use client";

import { useState, useEffect, createContext, useContext, createElement } from 'react';
import type { Settings } from '@/lib/types';
import { PRESET_GRADIENTS } from '@/lib/gradients';

const SETTINGS_KEY = 'orbital-dock-settings';

const defaultSettings: Settings = {
  iconSize: 80,
  dockIconSize: 64,
  showBackgroundPattern: true,
  useCustomGradient: false,
  gradientIndex: 0,
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
    
    let css = '';
    if (settings.useCustomGradient) {
        const gradient = PRESET_GRADIENTS[settings.gradientIndex];
        if (gradient) {
            const [start, mid, extra, end] = gradient.colors;
            css = `
            body {
                --gradient-start: ${start};
                --gradient-mid: ${mid};
                --gradient-extra: ${extra};
                --gradient-end: ${end};
            }
            `;
        }
    }
    styleElement.innerHTML = css;

  }, [settings.useCustomGradient, settings.gradientIndex, isMounted]);

  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const value = { settings, setSetting };

  return createElement(SettingsContext.Provider, { value }, children);
};
