import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider } from '@react-navigation/native';
import { DefaultTheme, DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { buildTheme, Theme, ThemeMode } from '@/theme';

interface AppThemeContextValue {
  theme: Theme;
  navTheme: NavigationTheme;
}

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
  override?: ThemeMode;
}

export const ThemeProvider = ({ children, override }: Props) => {
  const systemScheme = useColorScheme();
  const mode: ThemeMode = override ?? (systemScheme ?? 'light');
  const theme = useMemo(() => buildTheme(mode), [mode]);

  const navTheme = useMemo<NavigationTheme>(() => {
    const base = theme.isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.palette.primary,
        background: theme.palette.background,
        card: theme.palette.surface,
        text: theme.palette.text,
        border: theme.palette.surfaceMuted,
        notification: theme.palette.accent
      }
    };
  }, [theme]);

  const value = useMemo(() => ({ theme, navTheme }), [theme, navTheme]);

  return (
    <AppThemeContext.Provider value={value}>
      <StyledThemeProvider value={navTheme}>{children}</StyledThemeProvider>
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx.theme;
};

export const useNavTheme = () => {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useNavTheme must be used within ThemeProvider');
  }
  return ctx.navTheme;
};
