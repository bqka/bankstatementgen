import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/theme-provider';

interface StatusBadgeProps {
  status: 'idle' | 'generating' | 'success' | 'error';
  message?: string;
  style?: ViewStyle;
}

export const StatusBadge = ({ status, message, style }: StatusBadgeProps) => {
  const theme = useAppTheme();
  const palette = theme.palette;

  const config = {
    idle: {
      icon: 'information-circle' as const,
      color: palette.textMuted,
      backgroundColor: palette.surfaceMuted,
      label: 'Ready to generate',
    },
    generating: {
      icon: 'hourglass' as const,
      color: palette.info,
      backgroundColor: palette.primaryLight,
      label: 'Generating statement...',
    },
    success: {
      icon: 'checkmark-circle' as const,
      color: palette.success,
      backgroundColor: '#DCFCE7',
      label: 'Statement generated successfully',
    },
    error: {
      icon: 'alert-circle' as const,
      color: palette.error,
      backgroundColor: palette.errorLight,
      label: 'Generation failed',
    },
  }[status];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.color + '30',
        },
        style,
      ]}
    >
      {status === 'generating' ? (
        <ActivityIndicator size="small" color={config.color} />
      ) : (
        <Ionicons name={config.icon} size={18} color={config.color} />
      )}
      <Text
        style={[
          styles.text,
          {
            color: config.color,
          },
        ]}
      >
        {message || config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
