import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

interface FeedbackCardProps {
  isCorrect: boolean;
  explanation: string;
}

export default function FeedbackCard({ isCorrect, explanation }: FeedbackCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 30, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      style={[
        styles.container,
        { borderColor: isCorrect ? colors.teal : colors.coral },
        { backgroundColor: isCorrect ? 'rgba(0, 137, 123, 0.1)' : 'rgba(231, 76, 60, 0.1)' },
      ]}
    >
      <View style={styles.header}>
        <Ionicons
          name={isCorrect ? 'checkmark-circle' : 'close-circle'}
          size={28}
          color={isCorrect ? colors.teal : colors.coral}
        />
        <Text style={[
          styles.title,
          { color: isCorrect ? colors.teal : colors.coral },
        ]}>
          {isCorrect ? 'Correto!' : 'Incorreto'}
        </Text>
      </View>
      <Text style={styles.explanation}>{explanation}</Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.xl,
  },
  explanation: {
    color: colors.sand,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
});
