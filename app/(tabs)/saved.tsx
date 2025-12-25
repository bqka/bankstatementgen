import React from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/providers/theme-provider';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/currency';
import { exportStatementToPdf } from '@/services/pdf/exporter';

const SavedScreen = () => {
  const theme = useAppTheme();
  const palette = theme.palette;
  const statements = useAppStore((state) => state.savedStatements);
  const removeStatement = useAppStore((state) => state.removeStatement);

  const handleExport = async (id: string) => {
    const statement = statements.find((item) => item.id === id);
    if (!statement) return;
    try {
      const uri = await exportStatementToPdf(statement);
      Alert.alert('PDF exported', `Saved to ${uri}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Export failed', 'Unable to create PDF.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Statement',
      'Are you sure you want to delete this statement?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeStatement(id)
        }
      ]
    );
  };

  return (
    <Screen scroll={false} contentStyle={styles.screenContent}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: palette.text }]}>
            Saved Statements
          </Text>
          <Text style={[styles.headerSubtitle, { color: palette.textSecondary }]}>
            {statements.length} {statements.length === 1 ? 'statement' : 'statements'} saved
          </Text>
        </View>
      </View>

      <FlatList
        data={statements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const closingBalance = item.transactions[item.transactions.length - 1]?.balance ?? item.details.startingBalance;
          return (
            <Card variant="elevated" padding="large">
              <View style={styles.statementCard}>
                {/* Bank Badge */}
                <View style={styles.bankBadge}>
                  <View style={[styles.bankIcon, { backgroundColor: palette.primaryLight }]}>
                    <Ionicons name="business" size={20} color={palette.primary} />
                  </View>
                  <View style={styles.bankInfo}>
                    <Text style={[styles.bankName, { color: palette.text }]}>
                      {item.meta.template}
                    </Text>
                    <Text style={[styles.bankDetail, { color: palette.textMuted }]}>
                      {item.details.bankName}
                    </Text>
                  </View>
                </View>

                {/* Transaction Info */}
                <View style={[styles.infoSection, { backgroundColor: palette.backgroundAlt, borderColor: palette.borderLight }]}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="calendar-outline" size={16} color={palette.textMuted} />
                      <Text style={[styles.infoLabel, { color: palette.textMuted }]}>
                        Generated
                      </Text>
                    </View>
                    <Text style={[styles.infoValue, { color: palette.text }]}>
                      {formatDate(item.meta.generatedAt)}
                    </Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="swap-horizontal-outline" size={16} color={palette.textMuted} />
                      <Text style={[styles.infoLabel, { color: palette.textMuted }]}>
                        Transactions
                      </Text>
                    </View>
                    <Text style={[styles.infoValue, { color: palette.text }]}>
                      {item.transactions.length}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="wallet-outline" size={16} color={palette.textMuted} />
                      <Text style={[styles.infoLabel, { color: palette.textMuted }]}>
                        Closing Balance
                      </Text>
                    </View>
                    <Text style={[styles.balanceValue, { color: palette.success }]}>
                      {formatCurrency(closingBalance)}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <Button 
                    variant="primary" 
                    size="medium"
                    onPress={() => handleExport(item.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="download-outline" size={18} color="#FFF" />
                    {' '}Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="medium"
                    onPress={() => handleDelete(item.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="trash-outline" size={18} color={palette.error} />
                  </Button>
                </View>
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={() => (
          <Card variant="outlined" padding="large">
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: palette.primaryLight }]}>
                <Ionicons name="folder-open-outline" size={48} color={palette.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: palette.text }]}>
                No saved statements
              </Text>
              <Text style={[styles.emptyDescription, { color: palette.textMuted }]}>
                Generated statements will appear here. You can export them as PDF or remove them anytime.
              </Text>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  statementCard: {
    gap: 16,
  },
  bankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '700',
  },
  bankDetail: {
    fontSize: 14,
    marginTop: 2,
  },
  infoSection: {
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
});

export default SavedScreen;
