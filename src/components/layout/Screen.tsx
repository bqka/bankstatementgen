import React, { ComponentProps } from 'react';
import { SafeAreaView, ScrollView, View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { useAppTheme } from '@/providers/theme-provider';

type SafeAreaProps = ComponentProps<typeof SafeAreaView>;

interface Props extends SafeAreaProps {
  scroll?: boolean;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export const Screen = ({ children, scroll = true, style, contentStyle, ...rest }: Props) => {
  const theme = useAppTheme();
  const Container = scroll ? ScrollView : View;
  const scrollContentStyle = scroll
    ? [
        {
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
          paddingTop: theme.spacing.lg,
          gap: theme.spacing.lg
        },
        contentStyle
      ]
    : undefined;
  const viewStyle = !scroll
    ? [styles.viewContainer, { padding: theme.spacing.lg }, contentStyle]
    : [styles.viewContainer];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.palette.background }, style]}
      {...rest}
    >
      <Container
        contentContainerStyle={scroll ? (scrollContentStyle as any) : undefined}
        style={viewStyle as any}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
  }
});
