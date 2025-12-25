import { darkPalette, lightPalette, Palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export interface Theme {
  palette: Palette;
  spacing: typeof spacing;
  typography: typeof typography;
  isDark: boolean;
}

export type ThemeMode = 'light' | 'dark';

export const buildTheme = (mode: ThemeMode = 'light'): Theme => {
  const isDark = mode === 'dark';
  return {
    palette: isDark ? darkPalette : lightPalette,
    spacing,
    typography,
    isDark
  };
};
