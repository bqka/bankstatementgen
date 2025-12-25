import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/providers/theme-provider';
import { useAppStore } from '@/store/app-store';
import { bankTemplates } from '@/constants/bank-templates';

const HomeScreen = () => {
  const router = useRouter();
  const theme = useAppTheme();
  const palette = theme.palette;
  const setConfig = useAppStore((state) => state.setConfig);

  const handleSelect = (type: 'salaried' | 'selfEmployed') => {
    setConfig({ userType: type });
    router.push('/(tabs)/generate');
  };

  return (
    <Screen scroll={false} contentStyle={styles.screenContent}>
      <View style={styles.mainContent}>
        {/* Hero Section */}
        <Card
          variant="elevated"
          padding="large"
          style={{
            ...styles.heroCard,
            backgroundColor: palette.primary,
          }}
        >
          <View style={styles.heroContent}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={16} color={palette.primary} />
              <Text style={[styles.badgeText, { color: palette.primary }]}>
                Trusted & Secure
              </Text>
            </View>
            <Text
              style={[
                styles.heroTitle,
                {
                  fontSize: theme.typography.display.fontSize,
                  fontWeight: theme.typography.display.fontWeight,
                  lineHeight: theme.typography.display.lineHeight,
                  letterSpacing: theme.typography.display.letterSpacing,
                }
              ]}
            >
              Generate Bank Statements in Seconds
            </Text>
            <Text style={styles.heroSubtitle}>
              AI-powered realistic statements for {bankTemplates.length}+ Indian banks with instant PDF export
            </Text>
            
            <View style={styles.featureGrid}>
              <View style={styles.featureItem}>
                <Ionicons name="flash" size={20} color="#FFF" />
                <Text style={styles.featureText}>Instant</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="lock-closed" size={20} color="#FFF" />
                <Text style={styles.featureText}>Secure</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="document-text" size={20} color="#FFF" />
                <Text style={styles.featureText}>Realistic</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Profile Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            Choose your profile
          </Text>
          
          <View style={styles.cardGrid}>
            <Card
              variant="outlined"
              padding="large"
              onPress={() => handleSelect('salaried')}
              style={styles.profileCard}
            >
              <View style={[styles.iconContainer, { backgroundColor: palette.primaryLight }]}>
                <Ionicons name="briefcase" size={28} color={palette.primary} />
              </View>
              <View style={styles.profileContent}>
                <Text style={[styles.profileTitle, { color: palette.text }]}>
                  Salaried Professional
                </Text>
                <Text style={[styles.profileDescription, { color: palette.textSecondary }]}>
                  Auto-generate salary credits, allowances & realistic outflows
                </Text>
              </View>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={20} color={palette.primary} />
              </View>
            </Card>

            <Card
              variant="outlined"
              padding="large"
              onPress={() => handleSelect('selfEmployed')}
              style={styles.profileCard}
            >
              <View style={[styles.iconContainer, { backgroundColor: palette.accentMuted + '20' }]}>
                <Ionicons name="business" size={28} color={palette.accent} />
              </View>
              <View style={styles.profileContent}>
                <Text style={[styles.profileTitle, { color: palette.text }]}>
                  Self-Employed / Business
                </Text>
                <Text style={[styles.profileDescription, { color: palette.textSecondary }]}>
                  Smart turnover distribution & merchant payments
                </Text>
              </View>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={20} color={palette.accent} />
              </View>
            </Card>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={[styles.bottomSection, { borderTopColor: palette.border }]}>
        <Text style={[styles.bottomText, { color: palette.textMuted }]}>
          Need to resume a previous statement?
        </Text>
        <Button 
          variant="ghost" 
          onPress={() => router.push('/(tabs)/saved')}
          fullWidth
        >
          View saved statements
        </Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainContent: {
    gap: 24,
  },
  heroCard: {
    minHeight: 240,
  },
  heroContent: {
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    marginTop: 8,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    lineHeight: 22,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  cardGrid: {
    gap: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContent: {
    flex: 1,
    gap: 4,
  },
  profileTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  profileDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 14,
  },
});

export default HomeScreen;
