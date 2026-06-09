import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '@/components/ui/ProgressBar';
import Timer from '@/components/ui/Timer';
import { colors, spacing, fontSize, fontFamily } from '@/utils/theme';

interface ExamHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  timeRemaining: number | null;
  answeredCount: number;
  onClose?: () => void;
}

export default function ExamHeader({
  currentIndex,
  totalQuestions,
  timeRemaining,
  answeredCount,
  onClose,
}: ExamHeaderProps) {
  const progress = (currentIndex + 1) / totalQuestions;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {onClose && (
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.white} />
          </Pressable>
        )}
        <View style={styles.info}>
          <Text style={styles.questionCount}>
            Pergunta {currentIndex + 1} de {totalQuestions}
          </Text>
          <Text style={styles.answeredCount}>
            {answeredCount} respondidas
          </Text>
        </View>
        {timeRemaining !== null && (
          <Timer seconds={timeRemaining} />
        )}
      </View>
      <ProgressBar progress={progress} height={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.whiteAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  questionCount: {
    color: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
  },
  answeredCount: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
});
