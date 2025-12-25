import React from 'react';
import { ThemeProvider } from '@/providers/theme-provider';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '@/store/app-store';

const RootLayout = () => {
  const override = useAppStore((state) => state.darkModeOverride ?? undefined);
  return (
    <ThemeProvider override={override}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modals/ocr-import" options={{ presentation: 'modal', title: 'Upload PDF' }} />
        <Stack.Screen name="modals/pdf-preview" options={{ presentation: 'modal', title: 'Statement Preview' }} />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
