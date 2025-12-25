import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/theme-provider';

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}

interface Props<T> {
  label: string;
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  helperText?: string;
  error?: string;
}

export const Dropdown = <T,>({ label, options, value, onChange, helperText, error }: Props<T>) => {
  const theme = useAppTheme();
  const palette = theme.palette;
  const [expanded, setExpanded] = useState(false);

  const selected = useMemo(() => options.find((opt) => opt.value === value), [options, value]);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            color: error ? palette.error : expanded ? palette.primary : palette.text,
            fontSize: theme.typography.label.fontSize,
            fontWeight: '600',
            marginBottom: theme.spacing.xs,
            letterSpacing: 0.2
          }
        ]}
      >
        {label}
      </Text>
      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        style={[
          styles.selector,
          {
            borderRadius: 12,
            borderWidth: 2,
            borderColor: error ? palette.error : expanded ? palette.primary : palette.border,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            backgroundColor: palette.surface,
            shadowColor: expanded ? palette.primary : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: expanded ? 0.15 : 0,
            shadowRadius: 8,
            elevation: expanded ? 2 : 0,
          }
        ]}
      >
        <Text style={{ 
          color: selected ? palette.text : palette.textMuted, 
          flex: 1,
          fontSize: theme.typography.body.fontSize,
          fontWeight: selected ? '500' : '400'
        }}>
          {selected ? selected.label : 'Select an option'}
        </Text>
        <Ionicons 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={expanded ? palette.primary : palette.textMuted} 
        />
      </Pressable>
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
      {expanded && (
        <View
          style={[
            styles.dropdown,
            {
              marginTop: theme.spacing.sm,
              borderWidth: 2,
              borderColor: palette.primary,
              borderRadius: 12,
              backgroundColor: palette.surface,
              maxHeight: 280,
              shadowColor: palette.shadowColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 8,
            }
          ]}
        >
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {options.map((item, index) => (
              <Pressable
                key={String(item.value)}
                onPress={() => {
                  onChange(item.value);
                  setExpanded(false);
                }}
                style={({ pressed }) => [
                  styles.option,
                  {
                    paddingVertical: theme.spacing.md,
                    paddingHorizontal: theme.spacing.lg,
                    backgroundColor: pressed 
                      ? palette.primaryLight 
                      : item.value === value 
                      ? palette.primaryLight 
                      : palette.surface,
                    borderBottomWidth: index < options.length - 1 ? 1 : 0,
                    borderBottomColor: palette.borderLight,
                  }
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: item.value === value ? palette.primary : palette.text,
                      fontWeight: item.value === value ? '600' : '400'
                    }
                  ]}
                >
                  {item.label}
                </Text>
                {item.value === value && (
                  <Ionicons name="checkmark" size={20} color={palette.primary} />
                )}
              </Pressable>
            ))}
          </ScrollView>
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
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  helperText: {
    lineHeight: 18,
  },
  dropdown: {
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    flex: 1,
  }
});
