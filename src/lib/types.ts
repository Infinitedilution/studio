export interface App {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
  category: string;
  isCustom: boolean;
  isFavorite: boolean;
  description?: string;
}

export interface Settings {
  iconSize: number;
  dockIconSize: number;
  gradientIndex: number;
  mode: 'dock' | 'wiki';
}
