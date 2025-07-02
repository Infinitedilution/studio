"use client";

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { App } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }).refine(val => val.startsWith('https://'), { message: 'URL must be secure (https).' }),
  iconUrl: z.string(), // Can be a data URI or empty if using default
  category: z.string().min(2, { message: 'Category is required.' }),
});

interface EditAppDialogProps {
    app: App;
    onUpdateApp: (app: App) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditAppDialog({ app, onUpdateApp, isOpen, onOpenChange }: EditAppDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Use a placeholder if no custom iconUrl is set
  const [iconPreview, setIconPreview] = useState<string>(app.iconUrl || 'https://placehold.co/64x64.png');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: app.name,
        url: app.url,
        iconUrl: app.iconUrl || '',
        category: app.category,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
          name: app.name,
          url: app.url,
          iconUrl: app.iconUrl || '',
          category: app.category,
      });
      // If the app doesn't have a custom icon, show the proxy URL in preview
      const previewUrl = app.iconUrl?.startsWith('data:') 
        ? app.iconUrl 
        : `/api/icon?url=${encodeURIComponent(app.url)}`;
      setIconPreview(previewUrl);
    }
  }, [app, form, isOpen]);


  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast({ variant: 'destructive', title: 'File too large', description: 'Please select an image smaller than 1MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setIconPreview(dataUrl);
        form.setValue('iconUrl', dataUrl, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    onUpdateApp({ ...app, ...values });
    onOpenChange(false);
    toast({ title: 'App updated!', description: `${values.name} has been updated.` });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit {app.name}</DialogTitle>
          <DialogDescription>
            Make changes to your app and save.
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
                    <Input placeholder="https://example.com" {...field} disabled={!app.isCustom} />
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
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <div className="flex items-center gap-4">
                  <Image src={iconPreview} alt="Icon preview" width={64} height={64} className="rounded-lg bg-card object-cover" key={iconPreview} />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Upload Icon
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleIconChange}
                  />
              </div>
              <FormMessage>{form.formState.errors.iconUrl?.message}</FormMessage>
            </FormItem>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Productivity" {...field} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="font-semibold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
