import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { useAppTheme } from '@/providers/theme-provider';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  style?: ViewStyle;
  onPress?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card = ({ 
  children, 
  variant = 'default', 
  style, 
  onPress,
  padding = 'medium'
}: CardProps) => {
  const theme = useAppTheme();
  const palette = theme.palette;

  const paddingStyles = {
    none: 0,
    small: theme.spacing.md,
    medium: theme.spacing.lg,
    large: theme.spacing.xl
  }[padding];

  const variantStyles = {
    default: {
      backgroundColor: palette.surface,
      borderWidth: 0,
      shadowOpacity: 0,
    },
    elevated: {
      backgroundColor: palette.surfaceElevated,
      borderWidth: 0,
      shadowColor: palette.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    outlined: {
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
      shadowOpacity: 0,
    }
  }[variant];

  const content = (
    <View
      style={[
        styles.card,
        variantStyles,
        {
          borderRadius: 16,
          padding: paddingStyles,
        },
        style
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  }
});
