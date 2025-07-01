"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
import type { App } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { AppImage } from '@/components/AppImage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDescriptionAction } from '@/actions/generateDescriptionAction';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppDetailPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params?.id as string;

  const [app, setApp] = useState<App | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedAppsJSON = localStorage.getItem('sonic-dock-apps');
      if (storedAppsJSON) {
        const storedApps = JSON.parse(storedAppsJSON) as App[];
        setApps(storedApps);
        const foundApp = storedApps.find(a => a.id === appId);
        if (foundApp) {
          setApp(foundApp);
        } else {
          setError("App not found.");
        }
      } else {
        setError("App data not available.");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load app data.");
    } finally {
      setIsLoading(false);
    }
  }, [appId]);

  const generateDescription = useCallback(async () => {
    if (!app || app.description) return;

    setIsGenerating(true);
    try {
      const result = await generateDescriptionAction(app.name, app.url);
      if (result.description) {
        const newDescription = result.description;
        setApp(prevApp => prevApp ? { ...prevApp, description: newDescription } : null);
        
        const updatedApps = apps.map(a =>
          a.id === appId ? { ...a, description: newDescription } : a
        );
        localStorage.setItem('sonic-dock-apps', JSON.stringify(updatedApps));
        setApps(updatedApps);

      } else if (result.error) {
        setError(`Failed to generate description: ${result.error}`);
      }
    } catch (e) {
      console.error(e);
      setError("An unexpected error occurred while generating the description.");
    } finally {
      setIsGenerating(false);
    }
  }, [app, appId, apps]);

  useEffect(() => {
    if (app && !app.description) {
      generateDescription();
    }
  }, [app, generateDescription]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background text-foreground">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-destructive mb-6">{error || "Could not load app details."}</p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.push('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dock
        </Button>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start gap-6">
            <AppImage app={app} width={128} height={128} className="rounded-2xl bg-card object-cover shadow-lg flex-shrink-0" />
            <div className="flex-grow">
              <CardTitle className="text-4xl font-headline mb-2">{app.name}</CardTitle>
              <Badge variant="secondary" className="mb-4">{app.category}</Badge>
              <CardDescription>
                <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                  {app.url}
                </a>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Description</h3>
            {app.description ? (
              <p className="text-base/relaxed whitespace-pre-wrap">{app.description}</p>
            ) : isGenerating ? (
              <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
                <div className="text-muted-foreground">
                    <p>No description available.</p>
                    <Button variant="link" className="p-0 h-auto" onClick={generateDescription}>Try generating one?</Button>
                </div>
            )}
            <div className="mt-8 flex justify-end">
              <Button asChild size="lg">
                <a href={app.url} target="_blank" rel="noopener noreferrer">
                  Launch App <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
