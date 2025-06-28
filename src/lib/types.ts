export interface App {
  id: string;
  name: string;
  url: string;
  iconUrl: string;
  category: string;
  isCustom: boolean;
  isFavorite: boolean;
}

export interface Settings {
  iconSize: number;
  background: string;
  gradientFrom: string;
  gradientTo: string;
  gradientType: 'linear' | 'radial';
  patternColor: string;
  patternOpacity: number;
  patternGlow: boolean;
}
