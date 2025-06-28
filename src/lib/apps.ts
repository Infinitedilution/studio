import type { App } from './types';

export const defaultApps: App[] = [
  { id: '1', name: 'Notion', url: 'https://notion.so', iconUrl: 'https://placehold.co/128x128.png', category: 'Productivity', isCustom: false, isFavorite: true },
  { id: '2', name: 'Slack', url: 'https://slack.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Productivity', isCustom: false, isFavorite: true },
  { id: '3', name: 'Google Drive', url: 'https://drive.google.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Productivity', isCustom: false, isFavorite: true },
  { id: '4', name: 'Figma', url: 'https://figma.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Design', isCustom: false, isFavorite: true },
  { id: '5', name: 'X', url: 'https://x.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Social', isCustom: false },
  { id: '6', name: 'Instagram', url: 'https://instagram.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Social', isCustom: false },
  { id: '7', name: 'Google Maps', url: 'https://maps.google.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Utilities', isCustom: false },
  { id: '8', name: 'Spotify', url: 'https://spotify.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Entertainment', isCustom: false, isFavorite: true },
  { id: '9', name: 'GitHub', url: 'https://github.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Development', isCustom: false },
  { id: '10', name: 'VS Code', url: 'https://vscode.dev', iconUrl: 'https://placehold.co/128x128.png', category: 'Development', isCustom: false },
  { id: '11', name: 'Stack Overflow', url: 'https://stackoverflow.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Development', isCustom: false },
  { id: '12', name: 'YouTube', url: 'https://youtube.com', iconUrl: 'https://placehold.co/128x128.png', category: 'Entertainment', isCustom: false },
];

export const appHints: Record<string, string> = {
  'Notion': 'notes document',
  'Slack': 'team chat',
  'Google Drive': 'cloud storage',
  'Figma': 'design tool',
  'X': 'social media',
  'Instagram': 'photo sharing',
  'Google Maps': 'map navigation',
  'Spotify': 'music streaming',
  'GitHub': 'code repository',
  'VS Code': 'code editor',
  'Stack Overflow': 'developer forum',
  'YouTube': 'video platform',
};
