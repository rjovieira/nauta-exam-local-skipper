import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { ExamResult } from '@/utils/examEngine';
import { getExamHistory, clearHistory } from '@/utils/storage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

const MODE_LABELS: Record<string, string> = {
  real: 'Exame Real',
  study: 'Modo Estudo',
  custom: 'Personalizado',
};

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<ExamResult[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const loadHistory = async () => {
    const data = await getExamHistory();
    setHistory(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        {history.length > 0 && (
          <Button
            title="Limpar"
            variant="ghost"
            size="sm"
            onPress={handleClear}
          />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.ocean}
          />
        }
      >
        {history.length === 0 ? (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            style={styles.emptyState}
          >
            <Ionicons name="telescope-outline" size={64} color={colors.stormLight} />
            <Text style={styles.emptyTitle}>Nenhum exame realizado</Text>
            <Text style={styles.emptySubtitle}>
              Os resultados dos teus exames aparecerão aqui
            </Text>
          </MotiView>
        ) : (
          history.map((result, index) => (
            <MotiView
              key={result.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: index * 80 }}
            >
              <Card style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={[
                    styles.passIndicator,
                    { backgroundColor: result.passed ? colors.teal : colors.coral },
                  ]} />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultMode}>
                      {MODE_LABELS[result.mode] || result.mode}
                    </Text>
                    <Text style={styles.resultDate}>{formatDate(result.date)}</Text>
                  </View>
                  <View style={[
                    styles.scoreBadge,
                    { backgroundColor: result.passed ? `${colors.teal}20` : `${colors.coral}20` },
                  ]}>
                    <Text style={[
                      styles.scoreText,
                      { color: result.passed ? colors.teal : colors.coral },
                    ]}>
                      {result.percentage}%
                    </Text>
                  </View>
                </View>

                <View style={styles.resultMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={colors.teal} />
                    <Text style={styles.metaText}>
                      {result.correctAnswers}/{result.totalQuestions}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color={colors.stormLight} />
                    <Text style={styles.metaText}>
                      {formatDuration(result.timeSpent)}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name={result.passed ? 'trophy' : 'close-circle-outline'}
                      size={16}
                      color={result.passed ? colors.gold : colors.coral}
                    />
                    <Text style={[
                      styles.metaText,
                      { color: result.passed ? colors.gold : colors.coral },
                    ]}>
                      {result.passed ? 'Aprovado' : 'Reprovado'}
                    </Text>
                  </View>
                </View>
              </Card>
            </MotiView>
          ))
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xxl,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: spacing.md,
  },
  emptyTitle: {
    color: colors.sand,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.xl,
  },
  emptySubtitle: {
    color: colors.stormLight,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  resultCard: {
    padding: spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  passIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  resultInfo: {
    flex: 1,
  },
  resultMode: {
    color: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
  },
  resultDate: {
    color: colors.stormLight,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  scoreText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
  },
  resultMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    color: colors.stormLight,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
});
