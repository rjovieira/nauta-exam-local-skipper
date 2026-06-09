import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

interface BadgeProps {
  label: string;
  icon?: string;
  color?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ label, icon, color = colors.ocean, size = 'md' }: BadgeProps) {
  return (
    <View style={[
      styles.container,
      { backgroundColor: `${color}20` },
      size === 'sm' && styles.containerSm,
    ]}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={size === 'sm' ? 12 : 14}
          color={color}
        />
      )}
      <Text style={[
        styles.text,
        { color },
        size === 'sm' && styles.textSm,
      ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  containerSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
  textSm: {
    fontSize: fontSize.xs,
  },
});
