import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Question } from '@/utils/examEngine';
import { SUBJECTS } from '@/data/subjects';
import Badge from '@/components/ui/Badge';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
}

export default function QuestionCard({ question, index, total }: QuestionCardProps) {
  const subject = SUBJECTS[question.subject];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
      key={question.id}
      style={styles.container}
    >
      <View style={styles.header}>
        <Badge
          label={subject.name}
          icon={subject.icon}
          color={subject.color}
          size="sm"
        />
        <Text style={styles.counter}>
          {index + 1} / {total}
        </Text>
      </View>
      <Text style={styles.questionText}>{question.question}</Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.deepSea,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.whiteAlpha10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  counter: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
  questionText: {
    color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * 1.5,
  },
});
