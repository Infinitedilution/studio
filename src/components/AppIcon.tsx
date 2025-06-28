"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { App } from '@/lib/types';
import { appHints } from '@/lib/apps';

interface AppIconProps {
  app: App;
  isWiggleMode: boolean;
  onDelete: (id: string) => void;
}

export function AppIcon({ app, isWiggleMode, onDelete }: AppIconProps) {
  return (
    <motion.div
      layout
      className={cn(
        "relative flex flex-col items-center gap-2 text-center w-20 group",
        isWiggleMode && "animate-wiggle"
      )}
    >
      {app.isCustom && isWiggleMode && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full shadow-lg"
          onClick={() => onDelete(app.id)}
          aria-label={`Delete ${app.name}`}
        >
          <X className="h-4 w-4" />
        </Button>
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
            width={80}
            height={80}
            data-ai-hint={appHints[app.name] || app.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
            className="rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-card"
          />
          <div className="absolute inset-0 rounded-2xl bg-black/5 group-hover:bg-black/0 transition-colors" />
        </motion.div>
      </a>
      <p className="text-xs font-medium text-foreground truncate w-full">{app.name}</p>
    </motion.div>
  );
}
