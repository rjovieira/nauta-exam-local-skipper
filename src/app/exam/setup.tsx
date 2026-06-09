import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { SUBJECTS, SUBJECT_KEYS, SubjectKey } from '@/data/subjects';
import { useExam, ExamConfig } from '@/contexts/ExamContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

const QUESTION_COUNTS = [10, 15, 20, 25, 30];
const TIME_OPTIONS = [
  { label: 'Sem limite', value: null },
  { label: '30 min', value: 30 * 60 },
  { label: '60 min', value: 60 * 60 },
  { label: '90 min', value: 90 * 60 },
  { label: '120 min', value: 120 * 60 },
  { label: '180 min', value: 180 * 60 },
];

export default function SetupScreen() {
  const router = useRouter();
  const { startExam } = useExam();
  const insets = useSafeAreaInsets();

  const [questionCount, setQuestionCount] = useState(20);
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectKey[]>([]);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);

  const toggleSubject = (subject: SubjectKey) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleStart = () => {
    const config: ExamConfig = {
      questionCount,
      subjects: selectedSubjects,
      timeLimit,
    };
    startExam('custom', config);
    router.push('/exam/custom');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.title}>Exame Personalizado</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Count */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Text style={styles.sectionTitle}>Número de Perguntas</Text>
          <View style={styles.optionsRow}>
            {QUESTION_COUNTS.map(count => (
              <Pressable
                key={count}
                onPress={() => setQuestionCount(count)}
                style={[
                  styles.optionChip,
                  questionCount === count && styles.optionChipActive,
                ]}
              >
                <Text style={[
                  styles.optionChipText,
                  questionCount === count && styles.optionChipTextActive,
                ]}>
                  {count}
                </Text>
              </Pressable>
            ))}
          </View>
        </MotiView>

        {/* Time Limit */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
        >
          <Text style={styles.sectionTitle}>Limite de Tempo</Text>
          <View style={styles.optionsRow}>
            {TIME_OPTIONS.map(option => (
              <Pressable
                key={option.label}
                onPress={() => setTimeLimit(option.value)}
                style={[
                  styles.optionChip,
                  timeLimit === option.value && styles.optionChipActive,
                ]}
              >
                <Text style={[
                  styles.optionChipText,
                  timeLimit === option.value && styles.optionChipTextActive,
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </MotiView>

        {/* Subject Filter */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
        >
          <Text style={styles.sectionTitle}>
            Matérias {selectedSubjects.length > 0 ? `(${selectedSubjects.length})` : '(todas)'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            Deixa vazio para incluir todas as matérias
          </Text>
          <View style={styles.subjectList}>
            {SUBJECT_KEYS.map(key => {
              const subject = SUBJECTS[key];
              const isSelected = selectedSubjects.includes(key);
              return (
                <Pressable
                  key={key}
                  onPress={() => toggleSubject(key)}
                  style={[
                    styles.subjectChip,
                    isSelected && {
                      backgroundColor: `${subject.color}25`,
                      borderColor: subject.color,
                    },
                  ]}
                >
                  <Ionicons
                    name={subject.icon as any}
                    size={18}
                    color={isSelected ? subject.color : colors.stormLight}
                  />
                  <Text style={[
                    styles.subjectChipText,
                    isSelected && { color: subject.color },
                  ]}>
                    {subject.name}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={subject.color} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </MotiView>

        {/* Summary */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <Card variant="glass" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo</Text>
            <View style={styles.summaryRow}>
              <Ionicons name="help-circle-outline" size={18} color={colors.ocean} />
              <Text style={styles.summaryText}>{questionCount} perguntas</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="time-outline" size={18} color={colors.gold} />
              <Text style={styles.summaryText}>
                {timeLimit ? `${timeLimit / 60} minutos` : 'Sem limite de tempo'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="layers-outline" size={18} color={colors.teal} />
              <Text style={styles.summaryText}>
                {selectedSubjects.length === 0
                  ? 'Todas as matérias'
                  : selectedSubjects.map(s => SUBJECTS[s].name).join(', ')}
              </Text>
            </View>
          </Card>
        </MotiView>
      </ScrollView>

      {/* Start Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          title="Iniciar Exame"
          onPress={handleStart}
          size="lg"
          icon={<Ionicons name="play-circle" size={24} color={colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.whiteAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xl,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: colors.sand,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    color: colors.stormLight,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  optionChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.whiteAlpha10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionChipActive: {
    backgroundColor: `${colors.ocean}20`,
    borderColor: colors.ocean,
  },
  optionChipText: {
    color: colors.stormLight,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
  },
  optionChipTextActive: {
    color: colors.ocean,
    fontFamily: fontFamily.semibold,
  },
  subjectList: {
    gap: spacing.sm,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.whiteAlpha10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  subjectChipText: {
    flex: 1,
    color: colors.stormLight,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
  },
  summaryCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryTitle: {
    color: colors.white,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.lg,
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryText: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.navy,
    borderTopWidth: 1,
    borderTopColor: colors.whiteAlpha10,
  },
});
