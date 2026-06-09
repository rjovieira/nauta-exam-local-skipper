import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '@/utils/examEngine';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

interface TimerProps {
  seconds: number;
  totalSeconds?: number;
}

export default function Timer({ seconds, totalSeconds }: TimerProps) {
  const isWarning = seconds < 300; // < 5 min
  const isCritical = seconds < 60;  // < 1 min

  const timerColor = isCritical ? colors.coral : isWarning ? colors.gold : colors.white;

  return (
    <View style={[styles.container, isCritical && styles.criticalContainer]}>
      <Ionicons name="time-outline" size={18} color={timerColor} />
      <Text style={[styles.text, { color: timerColor }]}>
        {formatTime(seconds)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.whiteAlpha10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  criticalContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
  },
  text: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    fontVariant: ['tabular-nums'],
  },
});
