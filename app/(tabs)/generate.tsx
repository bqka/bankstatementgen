import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/providers/theme-provider';
import { Button } from '@/components/ui/Button';
import { SalariedForm } from '@/features/generate/components/SalariedForm';
import { SelfEmployedForm } from '@/features/generate/components/SelfEmployedForm';
import { StatementPreviewCard } from '@/features/generate/components/StatementPreviewCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useGenerateStatement } from '@/features/generate/hooks/use-generate-statement';
import { SalariedFormValues, SelfEmployedFormValues } from '@/features/generate/utils/types';
import { exportStatementToPdf } from '@/services/pdf/exporter';
import { useAppStore } from '@/store/app-store';

const GenerateScreen = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const palette = theme.palette;
  const config = useAppStore((state) => state.config);
  const setConfig = useAppStore((state) => state.setConfig);
  const { generate, regenerate, lastStatement, isGenerating } = useGenerateStatement();
  const updateStatement = useAppStore((state) => state.updateStatement);
  const [activeFlow, setActiveFlow] = useState<'salaried' | 'selfEmployed'>(
    config.userType ?? 'salaried'
  );
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');

  const handleSalariedSubmit = (values: SalariedFormValues) => {
    setConfig({ userType: 'salaried', bankTemplate: values.template });
    try {
      setGenerationStatus('generating');
      generate(values);
      setGenerationStatus('success');
      // Reset to idle after 3 seconds
      setTimeout(() => setGenerationStatus('idle'), 3000);
    } catch (error) {
      setGenerationStatus('error');
      setTimeout(() => setGenerationStatus('idle'), 3000);
      throw error;
    }
  };

  const handleSelfSubmit = (values: SelfEmployedFormValues) => {
    setConfig({ userType: 'selfEmployed', bankTemplate: values.template });
    try {
      setGenerationStatus('generating');
      generate(values);
      setGenerationStatus('success');
      // Reset to idle after 3 seconds
      setTimeout(() => setGenerationStatus('idle'), 3000);
    } catch (error) {
      setGenerationStatus('error');
      setTimeout(() => setGenerationStatus('idle'), 3000);
      throw error;
    }
  };

  const handleExport = async () => {
    if (!lastStatement) {
      return;
    }
    try {
      const uri = await exportStatementToPdf(lastStatement);
      updateStatement(lastStatement.id, { pdfUri: uri });
      Alert.alert('PDF exported', `Saved to ${uri}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Export failed', 'Unable to create PDF. Please try again.');
    }
  };

  return (
    <Screen scroll>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, { backgroundColor: palette.primaryLight }]}>
            <Ionicons name="document-text" size={28} color={palette.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: palette.text }]}>
              Generate Statement
            </Text>
            <Text style={[styles.headerSubtitle, { color: palette.textSecondary }]}>
              Create professional bank statements instantly
            </Text>
          </View>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabContainer, { backgroundColor: palette.surfaceMuted }]}>
        <Button
          variant={activeFlow === 'salaried' ? 'primary' : 'ghost'}
          size="medium"
          onPress={() => setActiveFlow('salaried')}
          style={styles.tab}
        >
          <View style={styles.tabContent}>
            <Ionicons 
              name="briefcase" 
              size={20} 
              color={activeFlow === 'salaried' ? '#FFF' : palette.textMuted} 
            />
            <Text style={{ 
              color: activeFlow === 'salaried' ? '#FFF' : palette.textMuted,
              fontWeight: '600',
              marginLeft: 8
            }}>
              Salaried
            </Text>
          </View>
        </Button>
        <Button
          variant={activeFlow === 'selfEmployed' ? 'primary' : 'ghost'}
          size="medium"
          onPress={() => setActiveFlow('selfEmployed')}
          style={styles.tab}
        >
          <View style={styles.tabContent}>
            <Ionicons 
              name="business" 
              size={20} 
              color={activeFlow === 'selfEmployed' ? '#FFF' : palette.textMuted} 
            />
            <Text style={{ 
              color: activeFlow === 'selfEmployed' ? '#FFF' : palette.textMuted,
              fontWeight: '600',
              marginLeft: 8
            }}>
              Self-Employed
            </Text>
          </View>
        </Button>
      </View>

      {/* Form Card */}
      <Card variant="elevated" padding="large">
        <View style={styles.formHeader}>
          <View style={styles.formTitleRow}>
            <View>
              <Text style={[styles.formTitle, { color: palette.text }]}>
                {activeFlow === 'salaried' ? 'Salaried Statement' : 'Self-Employed Statement'}
              </Text>
              <Text style={[styles.formSubtitle, { color: palette.textSecondary }]}>
                {activeFlow === 'salaried' 
                  ? 'Generate statement with salary credits & realistic expenses' 
                  : 'Create statement with business transactions & merchant payments'}
              </Text>
            </View>
          </View>
          <Button
            variant="outline"
            size="small"
            onPress={() => router.push('/modals/ocr-import')}
            style={styles.ocrButton}
          >
            <View style={styles.tabContent}>
              <Ionicons name="scan" size={16} color={palette.primary} />
              <Text style={{ color: palette.primary, marginLeft: 6, fontWeight: '600' }}>
                Auto-fill from PDF
              </Text>
            </View>
          </Button>
        </View>

        {/* Status Indicator */}
        {generationStatus !== 'idle' && (
          <StatusBadge status={generationStatus} style={{ marginBottom: 20 }} />
        )}

        {activeFlow === 'salaried' ? (
          <SalariedForm onSubmit={handleSalariedSubmit} isLoading={isGenerating} />
        ) : (
          <SelfEmployedForm onSubmit={handleSelfSubmit} isLoading={isGenerating} />
        )}
      </Card>

      {/* Preview or Empty State */}
      {lastStatement ? (
        <StatementPreviewCard
          statement={lastStatement}
          onExport={handleExport}
          onRegenerate={regenerate}
        />
      ) : (
        <Card variant="outlined" padding="large">
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: palette.primaryLight }]}>
              <Ionicons name="document-text-outline" size={48} color={palette.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: palette.text }]}>
              No statement generated yet
            </Text>
            <Text style={[styles.emptyDescription, { color: palette.textMuted }]}>
              Fill in the form above to generate a realistic bank statement. Preview transactions, export as PDF, and save for later use.
            </Text>
          </View>
        </Card>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 6,
    borderRadius: 14,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formHeader: {
    marginBottom: 24,
  },
  formTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  ocrButton: {
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    maxWidth: 400,
  },
});

export default GenerateScreen;
