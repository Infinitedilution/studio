"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { App } from '@/lib/types';
import { appHints } from '@/lib/apps';

interface AppIconProps {
  app: App;
  isWiggleMode: boolean;
  onDelete: (id: string) => void;
  onEdit: (app: App) => void;
  onToggleFavorite: (id: string) => void;
  iconSize: number;
}

export function AppIcon({ app, isWiggleMode, onEdit, onDelete, onToggleFavorite, iconSize }: AppIconProps) {
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };
  
  return (
    <motion.div
      className="relative flex flex-col items-center gap-1 text-center group"
      style={{ width: iconSize }}
      animate={isWiggleMode ? { rotate: [-1.5, 1.5, -1.5], transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" } } : { rotate: 0 }}
    >
      <div className="absolute top-1 left-1 z-10">
        <AnimatePresence>
        {isWiggleMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-background/50 backdrop-blur-sm text-foreground/80 hover:bg-primary/90 hover:text-primary-foreground"
                onClick={(e) => handleButtonClick(e, () => onToggleFavorite(app.id))}
                aria-label={`Favorite ${app.name}`}
              >
                <Star className={cn("h-3 w-3", app.isFavorite ? "fill-primary text-primary" : "text-foreground/60")} />
              </Button>
            </motion.div>
        )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {app.isCustom && isWiggleMode && (
          <motion.div 
              className="absolute top-1 right-1 z-10 flex items-center bg-background/50 backdrop-blur-sm rounded-full p-0.5 gap-0.5"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
          >
              <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full text-foreground/80 hover:bg-primary/90 hover:text-primary-foreground"
                  onClick={(e) => handleButtonClick(e, () => onEdit(app))}
                  aria-label={`Edit ${app.name}`}
              >
                  <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-5 w-5 rounded-full shadow-lg"
                onClick={(e) => handleButtonClick(e, () => onDelete(app.id))}
                aria-label={`Delete ${app.name}`}
              >
                <X className="h-3 w-3" />
              </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <a 
        href={app.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
        onClick={(e) => { if (isWiggleMode) e.preventDefault(); }}
      >
        <motion.div
          whileHover={{ scale: isWiggleMode ? 1 : 1.15, y: isWiggleMode ? 0 : -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="relative"
          style={{ width: iconSize, height: iconSize }}
        >
          <Image
            src={app.iconUrl}
            alt={`${app.name} icon`}
            width={256}
            height={256}
            data-ai-hint={appHints[app.name] || app.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
            className="rounded-2xl bg-card object-cover shadow-[0_4px_8px_rgba(0,0,0,0.1)] group-hover:shadow-lg dark:shadow-[0_4px_8px_rgba(0,0,0,0.4)] dark:group-hover:shadow-xl transition-shadow"
          />
          <div className="absolute inset-0 rounded-2xl bg-black/5 group-hover:bg-black/0 transition-colors" />
        </motion.div>
      </a>
      <p className="text-[11px] leading-tight pt-1 font-medium text-foreground/90 dark:text-foreground/80 truncate w-full">{app.name}</p>
    </motion.div>
  );
}
