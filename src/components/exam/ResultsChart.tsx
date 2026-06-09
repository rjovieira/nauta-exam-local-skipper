import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SUBJECTS, SubjectKey } from '@/data/subjects';
import { SubjectResult } from '@/utils/examEngine';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

interface ResultsChartProps {
  subjectResults: Record<SubjectKey, SubjectResult>;
}

function SubjectBar({ subject, result, index }: { subject: string; result: SubjectResult; index: number }) {
  const width = useSharedValue(0);
  const subjectInfo = SUBJECTS[subject as SubjectKey];

  useEffect(() => {
    width.value = withDelay(
      index * 150,
      withTiming(result.percentage, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    );
  }, [result.percentage]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.min(width.value, 100)}%`,
  }));

  if (!subjectInfo) return null;

  return (
    <View style={styles.barContainer}>
      <View style={styles.barHeader}>
        <View style={styles.barLabel}>
          <Ionicons name={subjectInfo.icon as any} size={16} color={subjectInfo.color} />
          <Text style={styles.barName}>{subjectInfo.name}</Text>
        </View>
        <View style={styles.barMeta}>
          <Text style={[
            styles.barPercentage,
            { color: result.passed ? colors.teal : colors.coral },
          ]}>
            {result.percentage}%
          </Text>
          <Text style={styles.barMinimum}>mín. {result.minPass}%</Text>
        </View>
      </View>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: result.passed ? colors.teal : colors.coral },
            barStyle,
          ]}
        />
        <View
          style={[
            styles.barThreshold,
            { left: `${result.minPass}%` },
          ]}
        />
      </View>
    </View>
  );
}

export default function ResultsChart({ subjectResults }: ResultsChartProps) {
  const entries = Object.entries(subjectResults);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados por Matéria</Text>
      {entries.map(([subject, result], index) => (
        <SubjectBar
          key={subject}
          subject={subject}
          result={result}
          index={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.xl,
    marginBottom: spacing.sm,
  },
  barContainer: {
    gap: spacing.xs,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  barName: {
    color: colors.sand,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
  barMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  barPercentage: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
  },
  barMinimum: {
    color: colors.stormLight,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.whiteAlpha10,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barThreshold: {
    position: 'absolute',
    top: -2,
    width: 2,
    height: 12,
    backgroundColor: colors.gold,
    borderRadius: 1,
  },
});
