export const lightPalette = {
  primary: '#6366F1', // Modern indigo
  primaryMuted: '#4F46E5',
  primaryLight: '#EEF2FF',
  accent: '#F59E0B', // Warm amber
  accentMuted: '#D97706',
  background: '#F9FAFB',
  backgroundAlt: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F4F6',
  surfaceElevated: '#FFFFFF',
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  success: '#10B981', // Emerald
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  shadowColor: '#6366F1',
  overlay: 'rgba(0, 0, 0, 0.5)'
};

export const darkPalette = {
  primary: '#818CF8', // Lighter indigo for dark mode
  primaryMuted: '#6366F1',
  primaryLight: '#1E1B4B',
  accent: '#FBBF24',
  accentMuted: '#F59E0B',
  background: '#0F172A', // Slate background
  backgroundAlt: '#1E293B',
  surface: '#1E293B',
  surfaceMuted: '#334155',
  surfaceElevated: '#334155',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  border: '#334155',
  borderLight: '#1E293B',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  errorLight: '#7F1D1D',
  info: '#60A5FA',
  shadowColor: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)'
};

export type Palette = typeof lightPalette;
