
import type { App } from './types';

export const defaultApps: App[] = [
  { id: '1', name: 'Notion', url: 'https://notion.so', iconUrl: 'https://unavatar.io/notion.so?size=256', category: 'Productivity', isCustom: false, isFavorite: true },
  { id: '2', name: 'Slack', url: 'https://slack.com', iconUrl: 'https://unavatar.io/slack.com?size=256', category: 'Productivity', isCustom: false, isFavorite: true },
  { id: '4', name: 'Figma', url: 'https://figma.com', iconUrl: 'https://unavatar.io/figma.com?size=256', category: 'Design', isCustom: false, isFavorite: true },
  { id: '8', name: 'Spotify', url: 'https://spotify.com', iconUrl: 'https://unavatar.io/spotify.com?size=256', category: 'Entertainment', isCustom: false, isFavorite: true },
  { id: '9', name: 'GitHub', url: 'https://github.com', iconUrl: 'https://unavatar.io/github.com?size=256', category: 'Development', isCustom: false, isFavorite: true },
  { id: '12', name: 'YouTube', url: 'https://youtube.com', iconUrl: 'https://unavatar.io/youtube.com?size=256', category: 'Entertainment', isCustom: false, isFavorite: false },
  { id: '13', name: 'Uniswap', url: 'https://app.uniswap.org', iconUrl: 'https://unavatar.io/app.uniswap.org?size=256', category: 'Dex', isCustom: false, isFavorite: true },
  { id: '14', name: 'Coinbase', url: 'https://www.coinbase.com', iconUrl: 'https://unavatar.io/coinbase.com?size=256', category: 'Cex', isCustom: false, isFavorite: false },
  { id: '15', name: 'Axie Infinity', url: 'https://axieinfinity.com', iconUrl: 'https://unavatar.io/axieinfinity.com?size=256', category: 'Web3 Games', isCustom: false, isFavorite: false },
  { id: '16', name: 'dogwifhat', url: 'https://dogwifcoin.org/', iconUrl: 'https://unavatar.io/dogwifcoin.org?size=256', category: 'Memes', isCustom: false, isFavorite: false },
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
