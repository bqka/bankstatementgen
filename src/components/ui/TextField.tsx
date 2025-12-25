import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/theme-provider';

interface Props {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'number-pad' | 'numeric' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  helperText?: string;
  error?: string;
  style?: any;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export const TextField = ({ 
  label, 
  helperText, 
  error, 
  style, 
  multiline = false,
  numberOfLines = 1,
  ...rest 
}: Props) => {
  const theme = useAppTheme();
  const palette = theme.palette;
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            color: error ? palette.error : isFocused ? palette.primary : palette.text,
            fontSize: theme.typography.label.fontSize,
            fontWeight: '600',
            marginBottom: theme.spacing.xs
          }
        ]}
      >
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            borderRadius: 12,
            borderWidth: 2,
            borderColor: error ? palette.error : isFocused ? palette.primary : palette.border,
            backgroundColor: palette.surface,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            color: palette.text,
            fontSize: theme.typography.body.fontSize,
            minHeight: multiline ? 100 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
            shadowColor: isFocused ? palette.primary : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isFocused ? 0.15 : 0,
            shadowRadius: 8,
            elevation: isFocused ? 2 : 0,
          },
          style
        ]}
        placeholderTextColor={palette.textMuted}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {(helperText || error) && (
        <View style={styles.helperContainer}>
          {error && (
            <Ionicons name="alert-circle" size={14} color={palette.error} style={{ marginRight: 4 }} />
          )}
          {helperText && !error && (
            <Ionicons name="information-circle-outline" size={14} color={palette.textMuted} style={{ marginRight: 4 }} />
          )}
          <Text
            style={[
              styles.helperText,
              {
                marginTop: 0,
                color: error ? palette.error : palette.textMuted,
                fontSize: theme.typography.caption.fontSize,
                flex: 1
              }
            ]}
          >
            {error ?? helperText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    width: '100%',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  helperText: {
    lineHeight: 18,
  }
});
