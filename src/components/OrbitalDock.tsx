"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grip, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { defaultApps } from '@/lib/apps';
import type { App } from '@/lib/types';
import { AddAppDialog } from '@/components/AddAppDialog';
import { AppIcon } from '@/components/AppIcon';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { appHints } from '@/lib/apps';
import { useDebounce } from '@/hooks/use-debounce';

export function OrbitalDock() {
  const [apps, setApps] = useState<App[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isWiggleMode, setIsWiggleMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedApps = localStorage.getItem('orbital-dock-apps');
      if (storedApps) {
        setApps(JSON.parse(storedApps));
      } else {
        setApps(defaultApps);
      }
    } catch (error) {
      console.error("Failed to parse apps from localStorage", error);
      setApps(defaultApps);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('orbital-dock-apps', JSON.stringify(apps));
    }
  }, [apps, isMounted]);

  const filteredApps = useMemo(() => {
    if (!debouncedSearchQuery) return apps;
    return apps.filter(app =>
      app.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [apps, debouncedSearchQuery]);

  const favoriteApps = useMemo(() => apps.filter(app => app.isFavorite), [apps]);

  const addApp = useCallback((newApp: Omit<App, 'id' | 'isCustom'>) => {
    const appToAdd: App = {
      ...newApp,
      id: crypto.randomUUID(),
      isCustom: true,
    };
    setApps(prev => [...prev, appToAdd]);
  }, []);

  const deleteApp = useCallback((id: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-20 flex justify-center p-4 bg-transparent">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 h-11 rounded-full bg-background/50 backdrop-blur-sm border-border/50 shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            />
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-4 sm:px-8 md:px-12">
        <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-headline font-bold text-foreground">Apps</h1>
            <div className="flex items-center gap-2">
                <AddAppDialog onAddApp={addApp} />
                 <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsWiggleMode(!isWiggleMode)}
                    className={cn("rounded-full transition-colors", isWiggleMode && "bg-accent text-accent-foreground border-accent")}
                    aria-pressed={isWiggleMode}
                >
                    <Grip className="h-5 w-5" />
                    <span className="sr-only">Toggle wiggle mode</span>
                </Button>
            </div>
        </div>
        
        <motion.div
          layout
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-4 gap-y-8 max-w-7xl mx-auto"
        >
          <AnimatePresence>
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <AppIcon app={app} isWiggleMode={isWiggleMode} onDelete={deleteApp} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredApps.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No apps found for "{debouncedSearchQuery}"</p>
            </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 flex justify-center p-4 z-20 pointer-events-none">
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
            className="bg-background/30 backdrop-blur-lg border border-border/20 rounded-2xl shadow-lg p-2 pointer-events-auto"
        >
            <div className="flex items-center gap-2">
                {favoriteApps.map((app) => (
                    <motion.a 
                        href={app.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        key={app.id}
                        whileHover={{ y: -8, scale: 1.2 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="group relative"
                        title={app.name}
                    >
                        <Image
                            src={app.iconUrl}
                            alt={`${app.name} icon`}
                            width={56}
                            height={56}
                            data-ai-hint={appHints[app.name]}
                            className="rounded-lg bg-card"
                        />
                         <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {app.name}
                        </span>
                    </motion.a>
                ))}
            </div>
        </motion.div>
      </footer>
    </div>
  );
}
