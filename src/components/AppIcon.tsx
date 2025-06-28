"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
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
  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center gap-2 text-center group",
        isWiggleMode && "animate-wiggle"
      )}
      style={{ width: iconSize }}
    >
      <div className="absolute -top-2 -left-2 z-10">
        {isWiggleMode && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-foreground/80 hover:bg-primary/90 hover:text-primary-foreground"
            onClick={() => onToggleFavorite(app.id)}
            aria-label={`Favorite ${app.name}`}
          >
            <Star className={cn("h-4 w-4", app.isFavorite ? "fill-primary text-primary" : "text-foreground/60")} />
          </Button>
        )}
      </div>

      {app.isCustom && isWiggleMode && (
         <div className="absolute -top-2 -right-2 z-10 flex items-center bg-background/50 backdrop-blur-sm rounded-full p-0.5 gap-0.5">
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full text-foreground/80 hover:bg-primary/90 hover:text-primary-foreground"
                onClick={() => onEdit(app)}
                aria-label={`Edit ${app.name}`}
            >
                <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6 rounded-full shadow-lg"
              onClick={() => onDelete(app.id)}
              aria-label={`Delete ${app.name}`}
            >
              <X className="h-4 w-4" />
            </Button>
        </div>
      )}
      <a href={app.url} target="_blank" rel="noopener noreferrer" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
        <motion.div
          whileHover={{ scale: 1.15, y: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="relative"
        >
          <Image
            src={app.iconUrl}
            alt={`${app.name} icon`}
            width={iconSize}
            height={iconSize}
            data-ai-hint={appHints[app.name] || app.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
            className="aspect-square rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-card object-cover"
          />
          <div className="absolute inset-0 rounded-2xl bg-black/5 group-hover:bg-black/0 transition-colors" />
        </motion.div>
      </a>
      <p className="text-xs font-medium text-foreground truncate w-full">{app.name}</p>
    </motion.div>
  );
}
