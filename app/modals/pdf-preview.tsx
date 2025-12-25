import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/providers/theme-provider';

const PdfPreviewModal = () => {
  const theme = useAppTheme();
  return (
    <Screen scroll>
      <View style={{ gap: theme.spacing.md }}>
        <Text style={{ fontSize: theme.typography.headline.fontSize, fontWeight: '700', color: theme.palette.text }}>
          PDF Preview
        </Text>
        <Text style={{ color: theme.palette.textMuted }}>
          Preview functionality coming soon. Use Export PDF to download and share your statement.
        </Text>
      </View>
    </Screen>
  );
};

export default PdfPreviewModal;
