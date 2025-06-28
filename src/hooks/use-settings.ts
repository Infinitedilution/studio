"use client";

import { useState, useEffect, useCallback, createContext, useContext, createElement } from 'react';
import type { Settings } from '@/lib/types';

const SETTINGS_KEY = 'orbital-dock-settings';

const defaultSettings: Settings = {
  iconSize: 80,
  background: 'dots',
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
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      
      document.body.classList.remove('bg-dots', 'bg-blueprint', 'bg-mesh');
      if (settings.background) {
        document.body.classList.add(`bg-${settings.background}`);
      }
    }
  }, [settings, isMounted]);

  const setSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const value = { settings, setSetting };

  return createElement(SettingsContext.Provider, { value }, children);
};
