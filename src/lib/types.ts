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
  dockIconSize: number;
  showBackgroundPattern: boolean;
  primaryColor: string;
  accentColor: string;
}
