import React from 'react';
import { ActivityIndicator, Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/providers/theme-provider';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  isLoading, 
  disabled, 
  style,
  fullWidth = false,
  ...rest 
}: ButtonProps) => {
  const theme = useAppTheme();
  const palette = theme.palette;

  const sizeStyles = {
    small: {
      paddingVertical: 10,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: 10,
    },
    medium: {
      paddingVertical: 14,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: 12,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: theme.spacing.xxl,
      borderRadius: 14,
    }
  }[size];

  const variantStyles = {
    primary: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: palette.surfaceMuted,
      borderColor: palette.border,
      borderWidth: 2,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: palette.primary,
      borderWidth: 2,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
    }
  }[variant];

  const textColor = {
    primary: '#FFFFFF',
    secondary: palette.text,
    outline: palette.primary,
    ghost: palette.primary
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: isLoading, disabled }}
      style={({ pressed }) => [
        styles.button,
        sizeStyles,
        variantStyles,
        {
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          width: fullWidth ? '100%' : undefined,
          shadowColor: variant === 'primary' ? palette.shadowColor : 'transparent',
          shadowOffset: variant === 'primary' ? { width: 0, height: 4 } : { width: 0, height: 0 },
          shadowOpacity: variant === 'primary' ? 0.25 : 0,
          shadowRadius: variant === 'primary' ? 12 : 0,
          elevation: variant === 'primary' ? 4 : 0,
        },
        style
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              color: textColor,
              fontSize: size === 'small' ? 14 : size === 'medium' ? 15 : 16,
              fontWeight: '600',
              letterSpacing: 0.3
            }
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  }
});
