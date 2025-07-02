export type Gradient = {
  name: string;
  colors: [string, string, string, string];
};

export const PRESET_GRADIENTS: Gradient[] = [
  { name: 'Twilight', colors: ['#0f172a', '#1e293b', '#64748b', '#e2e8f0'] },
  { name: 'Sunrise', colors: ['#f87171', '#fb923c', '#facc15', '#a3e635'] },
  { name: 'Ocean', colors: ['#38bdf8', '#3b82f6', '#6366f1', '#8b5cf6'] },
  { name: 'Forest', colors: ['#16a34a', '#22c55e', '#84cc16', '#facc15'] },
  { name: 'Grape', colors: ['#6d28d9', '#a855f7', '#d946ef', '#f472b6'] },
  { name: 'Cyberpunk', colors: ['#ec4899', '#d946ef', '#0ea5e9', '#6366f1'] },
  { name: 'Desert', colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fef08a'] },
  { name: 'Aurora', colors: ['#10b981', '#22d3ee', '#818cf8', '#e879f9'] },
  { name: 'Cosmic', colors: ['#1e1b4b', '#4c1d95', '#8b5cf6', '#a78bfa'] },
  { name: 'Sunset', colors: ['#f97316', '#ea580c', '#c2410c', '#7c2d12'] },
  { name: 'Minty', colors: ['#2dd4bf', '#22d3ee', '#67e8f9', '#a5f3fc'] },
  { name: 'Rose', colors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af'] },
  { name: 'Inferno', colors: ['#dc2626', '#ef4444', '#f87171', '#fca5a5'] },
];
