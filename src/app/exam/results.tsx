import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useExam } from '@/contexts/ExamContext';
import { SUBJECTS } from '@/data/subjects';
import { formatTime } from '@/utils/examEngine';
import ResultsChart from '@/components/exam/ResultsChart';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

const MODE_LABELS: Record<string, string> = {
  real: 'Exame Real',
  study: 'Modo Estudo',
  custom: 'Personalizado',
};

export default function ResultsScreen() {
  const router = useRouter();
  const { state, resetExam } = useExam();
  const insets = useSafeAreaInsets();
  const { result } = state;

  const scoreScale = useSharedValue(0);
  const scoreOpacity = useSharedValue(0);

  useEffect(() => {
    scoreOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    scoreScale.value = withDelay(200, withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    }));
  }, []);

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
    opacity: scoreOpacity.value,
  }));

  const handleRetry = () => {
    if (state.mode) {
      resetExam();
      router.dismissAll();
    }
  };

  const handleHome = () => {
    resetExam();
    router.dismissAll();
  };

  if (!result) {
    return (
      <View style={[styles.container, styles.centerContent, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.coral} />
        <Text style={styles.errorText}>Nenhum resultado disponível</Text>
        <Button title="Voltar ao Início" onPress={handleHome} variant="secondary" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.header}
        >
          <Text style={styles.modeLabel}>{MODE_LABELS[result.mode]}</Text>
          <Text style={styles.title}>Resultados</Text>
        </MotiView>

        {/* Score Circle */}
        <Animated.View style={[styles.scoreContainer, scoreAnimatedStyle]}>
          <View style={[
            styles.scoreCircle,
            {
              borderColor: result.passed ? colors.teal : colors.coral,
              backgroundColor: result.passed ? `${colors.teal}10` : `${colors.coral}10`,
            },
          ]}>
            <Ionicons
              name={result.passed ? 'trophy' : 'close-circle'}
              size={36}
              color={result.passed ? colors.gold : colors.coral}
            />
            <Text style={[
              styles.scorePercentage,
              { color: result.passed ? colors.teal : colors.coral },
            ]}>
              {result.percentage}%
            </Text>
            <Text style={[
              styles.scoreLabel,
              { color: result.passed ? colors.tealLight : colors.coralLight },
            ]}>
              {result.passed ? 'Aprovado!' : 'Reprovado'}
            </Text>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
          style={styles.statsRow}
        >
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={22} color={colors.teal} />
            <Text style={styles.statNumber}>{result.correctAnswers}</Text>
            <Text style={styles.statLabel}>Corretas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="close-circle" size={22} color={colors.coral} />
            <Text style={styles.statNumber}>{result.totalQuestions - result.correctAnswers}</Text>
            <Text style={styles.statLabel}>Incorretas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time" size={22} color={colors.gold} />
            <Text style={styles.statNumber}>{formatTime(result.timeSpent)}</Text>
            <Text style={styles.statLabel}>Tempo</Text>
          </View>
        </MotiView>

        {/* Subject Breakdown */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 600 }}
        >
          <Card style={styles.chartCard}>
            <ResultsChart subjectResults={result.subjectResults} />
          </Card>
        </MotiView>

        {/* Answer Review */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 800 }}
        >
          <Text style={styles.reviewTitle}>Revisão das Respostas</Text>
          {result.answers.map((answer, index) => {
            const question = state.questions[index];
            if (!question) return null;
            const subject = SUBJECTS[question.subject];
            return (
              <Card key={answer.questionId} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={[
                    styles.reviewIndicator,
                    { backgroundColor: answer.isCorrect ? colors.teal : colors.coral },
                  ]} />
                  <Text style={styles.reviewNumber}>#{index + 1}</Text>
                  <View style={[styles.reviewBadge, { backgroundColor: `${subject?.color || colors.ocean}20` }]}>
                    <Text style={[styles.reviewBadgeText, { color: subject?.color || colors.ocean }]}>
                      {subject?.name || question.subject}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewQuestion} numberOfLines={2}>
                  {question.question}
                </Text>
                <View style={styles.reviewAnswer}>
                  {answer.selectedAnswer !== null ? (
                    <Text style={[
                      styles.reviewAnswerText,
                      { color: answer.isCorrect ? colors.teal : colors.coral },
                    ]}>
                      Tua resposta: {question.options[answer.selectedAnswer]}
                    </Text>
                  ) : (
                    <Text style={[styles.reviewAnswerText, { color: colors.storm }]}>
                      Sem resposta
                    </Text>
                  )}
                  {!answer.isCorrect && (
                    <Text style={[styles.reviewAnswerText, { color: colors.teal }]}>
                      Correta: {question.options[answer.correctAnswer]}
                    </Text>
                  )}
                </View>
              </Card>
            );
          })}
        </MotiView>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Button
          title="Início"
          variant="secondary"
          size="md"
          onPress={handleHome}
          icon={<Ionicons name="home-outline" size={20} color={colors.ocean} />}
          style={styles.footerButton}
        />
        <Button
          title="Tentar Novamente"
          variant="primary"
          size="md"
          onPress={handleRetry}
          icon={<Ionicons name="refresh" size={20} color={colors.white} />}
          style={styles.footerButton}
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
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  errorText: {
    color: colors.sand,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.xl,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    paddingTop: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modeLabel: {
    color: colors.ocean,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xxl,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  scorePercentage: {
    fontFamily: fontFamily.headingBold,
    fontSize: 48,
  },
  scoreLabel: {
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.deepSea,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.whiteAlpha10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.whiteAlpha10,
  },
  statNumber: {
    color: colors.white,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xl,
  },
  statLabel: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
  },
  chartCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  reviewTitle: {
    color: colors.white,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.xl,
    marginBottom: spacing.md,
  },
  reviewCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  reviewIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reviewNumber: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
  },
  reviewBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  reviewBadgeText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
  },
  reviewQuestion: {
    color: colors.sand,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
    marginBottom: spacing.sm,
  },
  reviewAnswer: {
    gap: spacing.xs,
  },
  reviewAnswerText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.navy,
    borderTopWidth: 1,
    borderTopColor: colors.whiteAlpha10,
    gap: spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
