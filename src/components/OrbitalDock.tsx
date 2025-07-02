"use client";

import { useState, useEffect, useMemo, useCallback, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Grip, Search, Loader2, Settings as SettingsIcon, Filter, Sun, Moon, Plus, Check, Rocket, Book } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { defaultApps } from '@/lib/apps';
import type { App } from '@/lib/types';
import { AddAppDialog } from '@/components/AddAppDialog';
import { AppIcon } from '@/components/AppIcon';
import { cn } from '@/lib/utils';
import { appHints } from '@/lib/apps';
import { useDebounce } from '@/hooks/use-debounce';
import { EditAppDialog } from './EditAppDialog';
import { SettingsDialog } from './SettingsDialog';
import { useSettings } from '@/hooks/use-settings';
import { useTheme } from "next-themes";
import { useIsMobile, useWindowSize } from '@/hooks/use-mobile';
import { ScrollArea } from './ui/scroll-area';
import { AppImage } from './AppImage';

export function SonicDock() {
  const [apps, setApps] = useState<App[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isWiggleMode, setIsWiggleMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, setSetting } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { theme, setTheme } = useTheme();
  const [isAddAppDialogOpen, setIsAddAppDialogOpen] = useState(false);
  const [addAppInitialValue, setAddAppInitialValue] = useState<string | undefined>();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const isMobile = useIsMobile();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const debouncedSize = useDebounce(windowSize, 250);
  const [appsPerPage, setAppsPerPage] = useState(30);

  const changePage = (newPage: number) => {
    if (newPage === currentPage) return;
    setDirection(newPage > currentPage ? 1 : -1);
    setCurrentPage(newPage);
  };
  
  useEffect(() => {
    try {
      const storedAppsJSON = localStorage.getItem('sonic-dock-apps');
      let finalApps: App[] = defaultApps;

      if (storedAppsJSON) {
        const storedApps = JSON.parse(storedAppsJSON);
        if (Array.isArray(storedApps)) {
           // Create a map of IDs from defaultApps for quick lookups
          const defaultAppIds = new Set(defaultApps.map(app => app.id));
          
          // Get custom apps from storage
          const customApps = storedApps.filter((app: App) => app.isCustom === true);

          // Get all non-custom apps from storage that still exist in defaultApps
          const savedDefaultApps = storedApps.filter((app: App) => !app.isCustom && defaultAppIds.has(app.id));

          // Create a map of favorite and order statuses from all stored apps
          const statusMap = new Map<string, { isFavorite: boolean; order?: number, description?: string }>();
          storedApps.forEach((app: App, index: number) => {
            if (app && app.id) {
              statusMap.set(app.id, { isFavorite: app.isFavorite, order: index, description: app.description });
            }
          });

          // Update defaultApps with stored favorite status
          const updatedDefaultApps = defaultApps.map(app => ({
            ...app,
            isFavorite: statusMap.get(app.id)?.isFavorite ?? app.isFavorite,
            description: statusMap.get(app.id)?.description ?? app.description,
          }));

          // Combine the lists: updated default apps and custom apps
          let combinedApps = [...updatedDefaultApps, ...customApps];

          // Sort combined apps based on the stored order
          combinedApps.sort((a, b) => {
            const orderA = statusMap.get(a.id)?.order ?? Infinity;
            const orderB = statusMap.get(b.id)?.order ?? Infinity;
            return orderA - orderB;
          });
          
          finalApps = combinedApps;
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
      localStorage.setItem('sonic-dock-apps', JSON.stringify(apps));
    }
  }, [apps, isMounted]);

  useEffect(() => {
    if (settings.mode === 'wiki') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, [settings.mode, setTheme]);
  
  useEffect(() => {
    if (!isWiggleMode) {
      setCurrentPage(0);
      setDirection(0);
    }
  }, [debouncedSearchQuery, selectedCategory, isWiggleMode]);

  const startWiggleMode = useCallback(() => {
    if (!isWiggleMode) {
      setIsWiggleMode(true);
      if (isMobile) {
        setIsMobileSheetOpen(false);
      }
    }
  }, [isWiggleMode, isMobile]);

  const handleToggleWiggleMode = () => {
    setIsWiggleMode(prev => !prev);
    if (isMobile) {
      setIsMobileSheetOpen(false);
    }
  }

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Check if the click is on the main background, not on an app icon
    if (e.target === e.currentTarget && isWiggleMode) {
      setIsWiggleMode(false);
    }
  };
  
  const categories = useMemo(() => ['All', ...Array.from(new Set(apps.map(app => app.category))).sort()], [apps]);
  
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesSearch = !debouncedSearchQuery || app.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [apps, debouncedSearchQuery, selectedCategory]);

  const handleReorder = (newOrder: App[]) => {
    // Create a map of the new order for filtered apps
    const newOrderMap = new Map(newOrder.map((app, index) => [app.id, index]));
  
    // Create a new array for all apps, preserving the original order of non-filtered apps
    const reorderedApps = [...apps];
  
    reorderedApps.sort((a, b) => {
      const aIsFiltered = newOrderMap.has(a.id);
      const bIsFiltered = newOrderMap.has(b.id);
  
      if (aIsFiltered && bIsFiltered) {
        // Both are in the filtered list, sort by new order
        return (newOrderMap.get(a.id) ?? 0) - (newOrderMap.get(b.id) ?? 0);
      }
      if (aIsFiltered) return -1; // a is filtered, b is not, so a comes first
      if (bIsFiltered) return 1;  // b is filtered, a is not, so b comes first
      return 0; // Neither are in the filtered list, keep original relative order
    });
  
    setApps(reorderedApps);
  };
  

  useLayoutEffect(() => {
    const calculateAppsPerPage = () => {
      if (!mainRef.current || !headerRef.current || !gridRef.current) return;
      
      const mainStyle = getComputedStyle(mainRef.current);
      const mainPaddingTop = parseFloat(mainStyle.paddingTop);
      const mainPaddingBottom = parseFloat(mainStyle.paddingBottom);
      
      const availableHeight = mainRef.current.offsetHeight - mainPaddingTop - mainPaddingBottom;
      
      const iconContainerHeight = settings.iconSize + 24; // iconSize + text height + gap, estimated
      const gridRowGap = 24; // from gap-y-6 (1.5rem)
      const gridVPadding = 16; // from p-2 on grid container

      const numRows = Math.max(1, Math.floor(((availableHeight - gridVPadding) + gridRowGap) / (iconContainerHeight + gridRowGap)));
      
      const gridComputedStyle = getComputedStyle(gridRef.current);
      const numCols = gridComputedStyle.gridTemplateColumns.split(' ').length;
      
      if (numRows > 0 && numCols > 0) {
        setAppsPerPage(numRows * numCols);
      }
    };
    
    if (!isWiggleMode) {
      calculateAppsPerPage();
    }
  }, [debouncedSize, settings.iconSize, filteredApps, isWiggleMode]);

  const totalPages = useMemo(() => {
    if (isWiggleMode) return 1;
    return Math.ceil(filteredApps.length / appsPerPage);
  }, [filteredApps, appsPerPage, isWiggleMode]);
  
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const paginatedApps = useMemo(() => {
    if (isWiggleMode) return filteredApps;
    const startIndex = currentPage * appsPerPage;
    const endIndex = startIndex + appsPerPage;
    return filteredApps.slice(startIndex, endIndex);
  }, [filteredApps, currentPage, appsPerPage, isWiggleMode]);
  
  const favoriteApps = useMemo(() => apps.filter(app => app.isFavorite), [apps]);

  const dockIconSize = isMobile ? 48 : settings.dockIconSize;

  const addApp = (newApp: Omit<App, 'id' | 'isCustom'>) => {
    const appToAdd: App = { ...newApp, id: crypto.randomUUID(), isCustom: true };
    setApps(prev => [...prev, appToAdd]);
  };

  const updateApp = (updatedApp: App) => {
    setApps(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
    setEditingApp(null);
  };

  const deleteApp = (id: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, isFavorite: !app.isFavorite } : app));
  };

  const handleModeToggle = () => {
    setSetting('mode', settings.mode === 'dock' ? 'wiki' : 'dock');
  };
  
  const handleDragEnd = (e: any, { offset, velocity }: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const swipePower = Math.abs(offset.x) * velocity.x;
    const swipeConfidenceThreshold = 10000;

    if (swipePower < -swipeConfidenceThreshold) {
      if (currentPage < totalPages - 1) {
        changePage(currentPage + 1);
      }
    } else if (swipePower > swipeConfidenceThreshold) {
      if (currentPage > 0) {
        changePage(currentPage - 1);
      }
    }
  };

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

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
  const mobileSheetGlassStyle = "bg-background/80 backdrop-blur-xl border border-white/10 text-foreground placeholder:text-foreground/80";

  const desktopControls = (
    <div className="w-full max-w-5xl flex items-center gap-2">
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
                className={cn(`font-semibold h-10 px-5 rounded-full`, glassStyle)}
                onClick={handleModeToggle}
            >
                {settings.mode === 'dock' ? <Book className="mr-2 h-4 w-4" /> : <Rocket className="mr-2 h-4 w-4" />}
                Switch to {settings.mode === 'dock' ? 'Wiki' : 'Dock'}
            </Button>
            <Button
                className={cn(`font-semibold h-10 px-5 rounded-full`, glassStyle)}
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
                title={isWiggleMode ? "Done Editing" : "Toggle edit mode"}
            >
                {isWiggleMode ? <Check className="h-5 w-5" /> : <Grip className="h-5 w-5" />}
                <span className="sr-only">{isWiggleMode ? "Done Editing" : "Toggle edit mode"}</span>
            </Button>
            <Button size="icon" onClick={() => setIsSettingsOpen(true)} className={cn(`rounded-full h-10 w-10`, glassStyle, borderStyle)}>
                <SettingsIcon className="h-5 w-5" />
                 <span className="sr-only">Open Settings</span>
            </Button>
        </div>
    </div>
  );

  const mobileControls = (
    <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
      <SheetTrigger asChild>
        <Button size="icon" className={cn('rounded-full h-10 w-10 p-1.5', glassStyle, borderStyle)}>
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <defs>
                  <linearGradient id="icon-gradient" x1="12" y1="32" x2="52" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F97316"/>
                      <stop offset="1" stopColor="#3B82F6"/>
                  </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="31" stroke="url(#icon-gradient)" strokeWidth="3" fill="transparent"/>
              <g stroke="url(#icon-gradient)" strokeWidth="4" strokeLinecap="round">
                  <path d="M18 24 C 26 18, 38 18, 46 24" />
                  <path d="M16 32 H 48" />
                  <path d="M18 40 C 26 46, 38 46, 46 40" />
              </g>
            </svg>
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[80vh] overflow-y-auto bg-transparent backdrop-blur-xl border-t border-border/20"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Controls</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search DApps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isWiggleMode}
                className={cn(`w-full pl-11 pr-4 h-12 rounded-full text-base focus:ring-2 focus:ring-primary`, mobileSheetGlassStyle)}
              />
            </div>
            <Button
              size="icon"
              className={cn(`font-semibold h-12 w-12 rounded-full flex-shrink-0`, mobileSheetGlassStyle)}
              onClick={() => {
                setAddAppInitialValue(undefined);
                setIsAddAppDialogOpen(true);
                setIsMobileSheetOpen(false);
              }}
              aria-label="Add App"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add App</span>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className={cn(`w-full justify-between font-semibold h-12 px-5 rounded-full`, mobileSheetGlassStyle)} disabled={isWiggleMode}>
                <span>Filter: {selectedCategory}</span>
                <Filter className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                {categories.map(category => (
                  <DropdownMenuRadioItem key={category} value={category}>{category}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="grid grid-cols-4 gap-2">
            <Button
              onClick={handleToggleWiggleMode}
              className={cn(`rounded-full transition-colors h-12 w-full`, mobileSheetGlassStyle, isWiggleMode && "bg-accent text-accent-foreground border-accent")}
              aria-pressed={isWiggleMode}
              title="Toggle edit mode"
            >
              {isWiggleMode ? <Check className="h-5 w-5" /> : <Grip className="h-5 w-5" />}
            </Button>
            <Button size="icon" onClick={() => { setIsSettingsOpen(true); setIsMobileSheetOpen(false); }} className={cn(`rounded-full h-12 w-full`, mobileSheetGlassStyle)}>
              <SettingsIcon className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => {
                handleModeToggle();
                setIsMobileSheetOpen(false);
              }}
              className={cn(`rounded-full transition-colors h-12 w-full`, mobileSheetGlassStyle)}
              title={`Switch to ${settings.mode === 'dock' ? 'Wiki' : 'Dock'}`}
            >
              {settings.mode === 'dock' ? <Book className="h-5 w-5" /> : <Rocket className="h-5 w-5" />}
            </Button>
             <Button size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={cn(`rounded-full h-12 w-full`, mobileSheetGlassStyle)}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const renderWiggleModeGrid = () => (
    <ScrollArea className="h-full">
      <Reorder.Group
        as="div"
        axis="y"
        values={filteredApps}
        onReorder={handleReorder}
        className={cn("grid content-start gap-x-4 gap-y-6 p-2", gridCols)}
      >
        {filteredApps.map((app) => (
          <Reorder.Item
            key={app.id}
            value={app}
            className="relative flex flex-col items-center gap-1 text-center group"
            initial={{ scale: 1 }}
            whileDrag={{ scale: 1.1, zIndex: 10 }}
          >
             <motion.div animate={{ rotate: [-1.5, 1.5, -1.5], transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" } }}>
              <div style={{ width: settings.iconSize, height: settings.iconSize }} className="relative">
                <AppImage
                  app={app}
                  fill
                  sizes={`${settings.iconSize}px`}
                  data-ai-hint={appHints[app.name] || app.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
                  className="rounded-2xl bg-card object-cover shadow-lg"
                  draggable={false}
                />
              </div>
            </motion.div>
            <p className="text-[11px] leading-tight pt-1 font-bold text-foreground/90 dark:text-foreground/80 w-full h-[28px]">{app.name}</p>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </ScrollArea>
  );

  const renderNormalGrid = () => (
    <div className="relative overflow-hidden h-full">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          ref={gridRef}
          key={currentPage}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 35 },
            opacity: { duration: 0.2 }
          }}
          className={cn("absolute inset-0 grid content-start gap-x-4 gap-y-6 p-2", gridCols)}
        >
          {paginatedApps.map((app) => (
            <AppIcon
              key={app.id}
              app={app}
              isWiggleMode={isWiggleMode}
              onDelete={deleteApp}
              onEdit={setEditingApp}
              onToggleFavorite={toggleFavorite}
              iconSize={settings.iconSize}
              onStartWiggleMode={startWiggleMode}
              mode={settings.mode}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden transition-colors duration-300">
      <header ref={headerRef} className="flex flex-row items-center justify-between pt-6 mb-6 px-4 md:flex-col md:justify-center md:text-center md:pt-10 md:mb-8 md:gap-6">
        <h1 className="text-4xl font-headline font-light text-foreground md:text-5xl lg:text-6xl">
          {settings.mode === 'dock' ? 'SONIC DOCK' : 'Sonic Wiki'}
        </h1>
        {isMobile ? <div className="absolute top-8 right-4">{mobileControls}</div> : desktopControls}
      </header>

      <main 
        ref={mainRef} 
        className="flex-grow pb-36 px-4 sm:px-8 md:px-12 overflow-y-hidden overflow-x-hidden"
        onClick={handleBackgroundClick}
      >
        <div className="max-w-7xl mx-auto h-full">
          {isWiggleMode ? renderWiggleModeGrid() : renderNormalGrid()}

            {!isWiggleMode && totalPages > 1 && (
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      i === currentPage ? 'bg-primary' : 'bg-muted-foreground/50 hover:bg-muted-foreground'
                    )}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
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


      <footer className="fixed bottom-4 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
            className="bg-background/80 dark:bg-background/60 backdrop-blur-xl border border-border rounded-2xl shadow-lg pointer-events-auto max-w-full"
        >
            <div className="flex items-end gap-3 p-3 px-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory">
                <AnimatePresence>
                  {favoriteApps.map((app) => (
                      <motion.a 
                          href={app.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          key={app.id}
                          layoutId={`dock-${app.id}`}
                          whileHover={{ y: -8, scale: 1.2, zIndex: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className="group relative snap-center"
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
                            <AppImage
                                app={app}
                                fill
                                sizes={`${dockIconSize}px`}
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
