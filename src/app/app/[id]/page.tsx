"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Rocket } from 'lucide-react';
import type { App } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { generateDescriptionAction } from '@/actions/generateDescriptionAction';
import { cn } from '@/lib/utils';
import { defaultApps } from '@/lib/apps';

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [app, setApp] = useState<App | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(true);

  useEffect(() => {
    if (typeof params.id !== 'string') return;

    try {
      const storedAppsJSON = localStorage.getItem('orbital-dock-apps');
      let allApps: App[] = [];

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
          
          allApps = [...updatedDefaultApps, ...customApps];
        }
      } else {
        allApps = defaultApps;
      }
      
      const foundApp = allApps.find(a => a.id === params.id);
      if (foundApp) {
        setApp(foundApp);
      }
    } catch (error) {
      console.error("Failed to parse apps from localStorage", error);
    }
    setIsLoading(false);
  }, [params.id]);

  useEffect(() => {
    if (app) {
      const generateDesc = async () => {
        setIsDescriptionLoading(true);
        const result = await generateDescriptionAction(app.name, app.url);
        if (result.description) {
          setDescription(result.description);
        } else {
          setDescription('Could not load a description for this app.');
        }
        setIsDescriptionLoading(false);
      };
      generateDesc();
    }
  }, [app]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold text-foreground">App Not Found</h1>
        <p className="text-muted-foreground">The app you are looking for does not exist.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go Back Home</Button>
      </div>
    );
  }
  
  const glassStyle = "bg-black/10 backdrop-blur-xl border border-white/10 shadow-lg";

  return (
    <main className="min-h-screen p-4 sm:p-8 md:p-12 flex items-center justify-center">
       <Button 
        asChild
        variant="ghost" 
        className={cn("absolute top-8 left-8 h-12 w-12 rounded-full", glassStyle)}
      >
        <Link href="/">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to Home</span>
        </Link>
      </Button>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="flex flex-col items-center">
           <div className="relative w-48 h-48 md:w-64 md:h-64">
             <Image
                src={app.iconUrl}
                alt={`${app.name} icon`}
                fill
                className="rounded-3xl object-cover [filter:drop-shadow(0_6px_12px_rgba(0,0,0,0.4))]"
                sizes="(max-width: 768px) 192px, 256px"
              />
           </div>
        </div>
        <div className="flex flex-col gap-6 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold font-headline text-foreground [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                {app.name}
            </h1>
            <div className="min-h-[100px]">
                {isDescriptionLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                ) : (
                    <p className="text-lg text-foreground/80 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex justify-center md:justify-start">
                 <Button asChild size="lg" className="rounded-full font-semibold text-lg px-8 py-6 bg-primary/80 hover:bg-primary backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-primary/40 transition-shadow duration-300">
                    <a href={app.url} target="_blank" rel="noopener noreferrer">
                        <Rocket className="mr-2 h-5 w-5"/>
                        Launch App
                    </a>
                </Button>
            </div>
        </div>
      </div>
    </main>
  );
}
