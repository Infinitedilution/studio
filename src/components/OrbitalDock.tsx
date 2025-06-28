
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grip, Search, Loader2, Settings as SettingsIcon, Filter, Sun, Moon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultApps } from '@/lib/apps';
import type { App } from '@/lib/types';
import { AddAppDialog } from '@/components/AddAppDialog';
import { AppIcon } from '@/components/AppIcon';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { appHints } from '@/lib/apps';
import { useDebounce } from '@/hooks/use-debounce';
import { EditAppDialog } from './EditAppDialog';
import { SettingsDialog } from './SettingsDialog';
import { useSettings } from '@/hooks/use-settings';
import { useTheme } from "next-themes";
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

export function OrbitalDock() {
  const [apps, setApps] = useState<App[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isWiggleMode, setIsWiggleMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { theme, setTheme } = useTheme();
  const [isAddAppDialogOpen, setIsAddAppDialogOpen] = useState(false);
  const [addAppInitialValue, setAddAppInitialValue] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      const storedAppsJSON = localStorage.getItem('orbital-dock-apps');
      let finalApps: App[] = defaultApps;

      if (storedAppsJSON) {
        const storedApps = JSON.parse(storedAppsJSON);
        if (Array.isArray(storedApps)) {
          const customApps = storedApps.filter(app => app.isCustom === true);

          const favoriteStatusMap = new Map<string, boolean>();
          storedApps.forEach(app => {
            if (app && app.id) {
              favoriteStatusMap.set(app.id, app.isFavorite);
            }
          });

          const updatedDefaultApps = defaultApps.map(app => ({
            ...app,
            isFavorite: favoriteStatusMap.get(app.id) ?? app.isFavorite,
          }));
          
          finalApps = [...updatedDefaultApps, ...customApps];
        }
      }
      
      setApps(finalApps);
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
  
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchQuery, selectedCategory]);

  const handleToggleWiggleMode = () => {
    setIsWiggleMode(prev => !prev);
  }
  
  const categories = useMemo(() => ['All', ...Array.from(new Set(apps.map(app => app.category))).sort()], [apps]);
  
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesSearch = !debouncedSearchQuery || app.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [apps, debouncedSearchQuery, selectedCategory]);

  const APPS_PER_PAGE = 30;
  const totalPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);

  const paginatedApps = useMemo(() => {
    const startIndex = currentPage * APPS_PER_PAGE;
    const endIndex = startIndex + APPS_PER_PAGE;
    return filteredApps.slice(startIndex, endIndex);
  }, [filteredApps, currentPage]);
  
  const favoriteApps = useMemo(() => apps.filter(app => app.isFavorite), [apps]);

  const dockIconSize = isMobile ? 48 : settings.dockIconSize;

  const addApp = useCallback((newApp: Omit<App, 'id' | 'isCustom'>) => {
    const appToAdd: App = { ...newApp, id: crypto.randomUUID(), isCustom: true };
    setApps(prev => [...prev, appToAdd]);
  }, []);

  const updateApp = useCallback((updatedApp: App) => {
    setApps(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
    setEditingApp(null);
  }, []);

  const deleteApp = useCallback((id: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, isFavorite: !app.isFavorite } : app));
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const gridCols = `grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10`;
  const glassStyle = "text-foreground bg-background/80 backdrop-blur-sm border-border hover:bg-background/90";
  const borderStyle = "border-slate-400 dark:border-white/20 dark:hover:bg-white/20";

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <main className="flex-grow pt-12 pb-48 px-4 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col items-center justify-center text-center mb-10 gap-6">
                <h1 className="text-6xl font-headline font-light text-foreground">Sonic Dapps</h1>
                <div className="w-full max-w-3xl flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" className={cn(`h-10 w-10 flex-shrink-0 rounded-full`, glassStyle, borderStyle)} disabled={isWiggleMode}>
                                <Filter className="h-5 w-5" />
                                <span className="sr-only">Filter by category</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                            {categories.map(category => (
                                <DropdownMenuRadioItem key={category} value={category}>{category}</DropdownMenuRadioItem>
                            ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="relative flex-grow">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Search DApps..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isWiggleMode}
                        className={cn(`w-full pl-12 pr-4 py-3 h-10 rounded-full text-base focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background`, glassStyle, borderStyle)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className={cn(`font-semibold h-12 px-5 rounded-full`, glassStyle)}
                            onClick={() => {
                                setAddAppInitialValue(undefined);
                                setIsAddAppDialogOpen(true);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add App
                        </Button>
                        <Button
                            size="icon"
                            onClick={handleToggleWiggleMode}
                            className={cn(`rounded-full transition-colors h-10 w-10`, glassStyle, borderStyle, isWiggleMode && "bg-accent text-accent-foreground border-accent")}
                            aria-pressed={isWiggleMode}
                            title="Toggle edit mode"
                        >
                            <Grip className="h-5 w-5" />
                            <span className="sr-only">Toggle edit mode</span>
                        </Button>
                        <Button size="icon" onClick={() => setIsSettingsOpen(true)} className={cn(`rounded-full h-10 w-10`, glassStyle, borderStyle)}>
                            <SettingsIcon className="h-5 w-5" />
                             <span className="sr-only">Open Settings</span>
                        </Button>
                        <Button size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={cn(`rounded-full h-10 w-10`, glassStyle, borderStyle)}>
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </div>
            </header>
            
            <motion.div
              layout
              className={cn("grid gap-x-4 gap-y-8", gridCols)}
            >
              <AnimatePresence>
              {paginatedApps.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative z-0"
                >
                  <AppIcon app={app} isWiggleMode={isWiggleMode} onDelete={deleteApp} onEdit={setEditingApp} onToggleFavorite={toggleFavorite} iconSize={settings.iconSize}/>
                </motion.div>
              ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center justify-center gap-4">
                <Label htmlFor="page-slider" className="font-medium text-foreground/80">
                  Page {currentPage + 1} of {totalPages}
                </Label>
                <Slider
                  id="page-slider"
                  min={0}
                  max={totalPages - 1}
                  step={1}
                  value={[currentPage]}
                  onValueChange={(value) => setCurrentPage(value[0])}
                  className="w-full max-w-sm"
                />
              </div>
            )}

            {filteredApps.length === 0 && !isWiggleMode && (
                <div className="text-center py-16 text-muted-foreground">
                    {debouncedSearchQuery ? (
                        <>
                            <p className="text-lg">No app found for &quot;{debouncedSearchQuery}&quot;</p>
                            <Button
                                variant="link"
                                className="text-lg text-primary"
                                onClick={() => {
                                    setAddAppInitialValue(debouncedSearchQuery);
                                    setIsAddAppDialogOpen(true);
                                }}
                            >
                                Add it as a new app?
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-lg">No apps found</p>
                            <p className="text-sm">Try a different search or filter.</p>
                        </>
                    )}
                </div>
            )}
        </div>
      </main>

      <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      {editingApp && <EditAppDialog app={editingApp} isOpen={!!editingApp} onOpenChange={(open) => !open && setEditingApp(null)} onUpdateApp={updateApp} />}
      <AddAppDialog 
        onAddApp={addApp}
        isOpen={isAddAppDialogOpen}
        onOpenChange={setIsAddAppDialogOpen}
        initialValue={addAppInitialValue}
      />


      <footer className="fixed bottom-0 left-0 right-0 flex justify-center p-4 z-20 pointer-events-none">
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
            className="bg-background/80 dark:bg-background/60 backdrop-blur-xl border border-border rounded-2xl shadow-lg p-3 pointer-events-auto max-w-full"
        >
            <div className="flex items-end justify-center gap-3 p-1 overflow-x-auto">
                <AnimatePresence>
                  {favoriteApps.map((app) => (
                      <motion.a 
                          href={app.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          key={app.id}
                          layoutId={`dock-${app.id}`}
                          whileHover={{ y: -8, scale: 1.2 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className="group relative"
                          title={app.name}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                      >
                          <div
                            style={{
                              width: dockIconSize,
                              height: dockIconSize,
                            }}
                            className="relative"
                          >
                            <Image
                                src={app.iconUrl}
                                alt={`${app.name} icon`}
                                width={128}
                                height={128}
                                data-ai-hint={appHints[app.name] || app.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
                                className="rounded-lg bg-card object-cover"
                            />
                          </div>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {app.name}
                          </span>
                      </motion.a>
                  ))}
                </AnimatePresence>
                {favoriteApps.length === 0 && (
                  <div 
                    className="flex items-center justify-center px-4 text-sm text-muted-foreground"
                    style={{ height: dockIconSize }}
                  >
                    Favorite apps to add them to the dock
                  </div>
                )}
            </div>
        </motion.div>
      </footer>
    </div>
  );
}
