
"use client";

import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import type { Settings } from '@/lib/types';
import { PRESET_GRADIENTS } from '@/lib/gradients';

const SETTINGS_KEY = 'sonic-dock-settings';

const defaultSettings: Settings = {
  iconSize: 80,
  dockIconSize: 64,
  gradientIndex: 7, // Set to Aurora by default
  mode: 'dock',
};

type SetSettingFn = (key: keyof Settings, value: Settings[keyof Settings]) => void;

interface SettingsContextType {
  settings: Settings;
  setSetting: SetSettingFn;
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
    styleElement.innerHTML = css;

  }, [settings.gradientIndex, isMounted]);

  const setSetting: SetSettingFn = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const value = useMemo(() => ({ settings, setSetting }), [settings, setSetting]);

  return React.createElement(SettingsContext.Provider, { value: value }, children);
};
