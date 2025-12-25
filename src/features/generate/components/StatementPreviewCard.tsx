import React from 'react';
import { View, Text } from 'react-native';
import { Statement } from '@/types/statement';
import { useAppTheme } from '@/providers/theme-provider';
import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/currency';
import { Button } from '@/components/ui/Button';

interface Props {
  statement: Statement;
  onExport: () => void;
  onRegenerate: () => void;
}

export const StatementPreviewCard = ({ statement, onExport, onRegenerate }: Props) => {
  const theme = useAppTheme();
  const palette = theme.palette;
  const lastTransaction = statement.transactions[statement.transactions.length - 1];

  return (
    <View
      style={{
        padding: theme.spacing.xl,
        borderRadius: 20,
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.surfaceMuted,
        gap: theme.spacing.lg
      }}
    >
      <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ fontSize: theme.typography.title.fontSize, fontWeight: '700', color: palette.text }}>
          {statement.details.bankName} • {statement.meta.template}
        </Text>
        <Text style={{ color: palette.textMuted }}>
          Generated {formatDate(statement.meta.generatedAt)} • {statement.transactions.length} transactions
        </Text>
      </View>
      <View style={{ gap: theme.spacing.sm }}>
        <Text style={{ color: palette.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Balances</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: palette.textMuted, marginBottom: theme.spacing.xs }}>Opening balance</Text>
            <Text style={{ fontSize: theme.typography.headline.fontSize, fontWeight: '700', color: palette.text }}>
              {formatCurrency(statement.details.startingBalance)}
            </Text>
          </View>
          <View>
            <Text style={{ color: palette.textMuted, marginBottom: theme.spacing.xs }}>Closing balance</Text>
            <Text style={{ fontSize: theme.typography.headline.fontSize, fontWeight: '700', color: palette.success }}>
              {formatCurrency(lastTransaction?.balance ?? statement.details.startingBalance)}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ gap: theme.spacing.md }}>
        <Button onPress={onExport}>Export to PDF</Button>
        <Button variant="secondary" onPress={onRegenerate}>
          Regenerate with new pattern
        </Button>
      </View>
    </View>
  );
};
