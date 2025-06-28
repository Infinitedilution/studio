
import type { App } from './types';

export const defaultApps: App[] = [
  { id: '1', name: 'Notion', url: 'https://notion.so', iconUrl: 'https://www.google.com/s2/favicons?domain=notion.so&sz=512', category: 'Productivity', isCustom: false, isFavorite: true },
  { id: '2', name: 'Slack', url: 'https://slack.com', iconUrl: 'https://www.google.com/s2/favicons?domain=slack.com&sz=512', category: 'Productivity', isCustom: false, isFavorite: true },
  { id: '4', name: 'Figma', url: 'https://figma.com', iconUrl: 'https://www.google.com/s2/favicons?domain=figma.com&sz=512', category: 'Design', isCustom: false, isFavorite: true },
  { id: '8', name: 'Spotify', url: 'https://spotify.com', iconUrl: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=512', category: 'Entertainment', isCustom: false, isFavorite: true },
  { id: '9', name: 'GitHub', url: 'https://github.com', iconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=512', category: 'Development', isCustom: false, isFavorite: true },
  { id: '12', name: 'YouTube', url: 'https://youtube.com', iconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=512', category: 'Entertainment', isCustom: false, isFavorite: false },
  { id: '13', name: 'Uniswap', url: 'https://app.uniswap.org', iconUrl: 'https://www.google.com/s2/favicons?domain=app.uniswap.org&sz=512', category: 'Dex', isCustom: false, isFavorite: true },
  { id: '14', name: 'Coinbase', url: 'https://www.coinbase.com', iconUrl: 'https://www.google.com/s2/favicons?domain=coinbase.com&sz=512', category: 'Cex', isCustom: false, isFavorite: false },
  { id: '15', name: 'Axie Infinity', url: 'https://axieinfinity.com', iconUrl: 'https://www.google.com/s2/favicons?domain=axieinfinity.com&sz=512', category: 'Web3 Games', isCustom: false, isFavorite: false },
  { id: '16', name: 'dogwifhat', url: 'https://dogwifcoin.org/', iconUrl: 'https://www.google.com/s2/favicons?domain=dogwifcoin.org&sz=512', category: 'Memes', isCustom: false, isFavorite: false },
];

export const appHints: Record<string, string> = {
  'Notion': 'notes document',
  'Slack': 'team chat',
  'Figma': 'design tool',
  'Spotify': 'music streaming',
  'GitHub': 'code repository',
  'YouTube': 'video platform',
  'Uniswap': 'decentralized exchange',
  'Coinbase': 'crypto exchange',
  'Axie Infinity': 'blockchain game',
  'dogwifhat': 'meme coin',
};
