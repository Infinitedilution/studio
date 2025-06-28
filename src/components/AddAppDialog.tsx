"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import type { App } from '@/lib/types';
import { suggestCategoryAction, getFaviconAction } from '@/actions/suggestCategoryAction';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }).refine(val => val.startsWith('https://'), { message: 'URL must be secure (https).' }),
  category: z.string().min(2, { message: 'Category is required.' }),
});

export function AddAppDialog({ onAddApp }: { onAddApp: (app: Omit<App, 'id' | 'isCustom'>) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', url: '', category: '' },
  });

  const handleUrlBlur = async () => {
    let url = form.getValues('url').trim();
    if (!url) return;

    if (!/^https?:\/\//i.test(url)) {
      if (!url.includes('.')) {
        // do nothing if it's not a valid TLD yet
      } else if (!url.startsWith('www.')) {
        url = 'https://www.' + url;
      } else {
        url = 'https://' + url;
      }
      form.setValue('url', url, { shouldDirty: true });
    }

    const isUrlValid = await form.trigger('url');
    if (isUrlValid) {
      setIsSuggesting(true);
      try {
        const [categoryRes] = await Promise.all([
            suggestCategoryAction(url),
        ]);

        if(!form.getValues('name')) {
            const nameRes = new URL(url).hostname.replace('www.', '').split('.')[0];
            const capitalizedName = nameRes.charAt(0).toUpperCase() + nameRes.slice(1);
            form.setValue('name', capitalizedName, { shouldValidate: true });
        }
        
        if (categoryRes.category) {
          form.setValue('category', categoryRes.category, { shouldValidate: true });
        }
        
        if (categoryRes.error) {
          toast({ variant: 'destructive', title: 'Suggestion Error', description: categoryRes.error });
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch suggestions.' });
      } finally {
        setIsSuggesting(false);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { iconUrl } = await getFaviconAction(values.url);
    onAddApp({ ...values, iconUrl, isFavorite: false });
    form.reset();
    setIsOpen(false);
    toast({ title: 'App added!', description: `${values.name} has been added to your dock.` });
  };

  const glassStyle = "text-foreground border bg-background/80 backdrop-blur-sm border-slate-300 hover:border-slate-400 dark:bg-white/10 dark:shadow-[inset_0_1px_1px_#FFFFFF0D] dark:border-white/20 dark:hover:bg-white/20";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={cn(`font-semibold h-12 px-5 rounded-full`, glassStyle)}>
          <Plus className="mr-2 h-4 w-4" /> Add App
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add a new app</DialogTitle>
          <DialogDescription>
            Enter a URL to automatically get suggestions for the app's name and category.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} onBlur={handleUrlBlur} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="e.g., Productivity" {...field} />
                    </FormControl>
                    {isSuggesting && (
                      <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSuggesting} className="font-semibold">
                {isSuggesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add App
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
