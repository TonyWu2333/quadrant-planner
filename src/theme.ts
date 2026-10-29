import { useColorScheme } from 'react-native';

const light = {
  background: '#F5F4F0',
  surface: '#FFFFFF',
  surfaceMuted: '#EFEEEA',
  text: '#18181B',
  textSecondary: '#6B6B73',
  textTertiary: '#A1A1AA',
  border: '#E4E2DC',
  backdrop: 'rgba(16, 16, 20, 0.36)',
  inverse: '#18181B',
  onInverse: '#FFFFFF',
  danger: '#E5484D',
  tintAlpha: 0.11,
};

const dark: typeof light = {
  background: '#0E0E11',
  surface: '#1A1A1F',
  surfaceMuted: '#232329',
  text: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textTertiary: '#63636E',
  border: '#2B2B32',
  backdrop: 'rgba(0, 0, 0, 0.6)',
  inverse: '#F4F4F5',
  onInverse: '#18181B',
  danger: '#FF6369',
  tintAlpha: 0.16,
};

export type Theme = typeof light & { dark: boolean };

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? { ...dark, dark: true } : { ...light, dark: false };
}

/** `#RRGGBB` + alpha → `rgba(...)`, used for the soft quadrant tints. */
export function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
