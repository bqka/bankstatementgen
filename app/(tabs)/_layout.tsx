import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useAppTheme } from '@/providers/theme-provider';

const TabsLayout = () => {
  const theme = useAppTheme();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.palette.primary,
        tabBarInactiveTintColor: theme.palette.textMuted,
        tabBarStyle: {
          backgroundColor: theme.palette.surface,
          borderTopColor: theme.palette.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: focused ? 'home' : 'home-outline',
            generate: focused ? 'add-circle' : 'add-circle-outline',
            saved: focused ? 'bookmark' : 'bookmark-outline'
          };
          const iconName = icons[route.name] ?? 'ellipse-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        }
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home'
        }} 
      />
      <Tabs.Screen 
        name="generate" 
        options={{ 
          title: 'Generate',
          tabBarLabel: 'Generate'
        }} 
      />
      <Tabs.Screen 
        name="saved" 
        options={{ 
          title: 'Saved',
          tabBarLabel: 'Saved'
        }} 
      />
    </Tabs>
  );
};

export default TabsLayout;
