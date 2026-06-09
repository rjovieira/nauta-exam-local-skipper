import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SUBJECTS, SUBJECT_KEYS, SubjectKey } from '@/data/subjects';
import { useExam } from '@/contexts/ExamContext';
import Card from '@/components/ui/Card';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

export default function StudyScreen() {
  const router = useRouter();
  const { startExam } = useExam();
  const insets = useSafeAreaInsets();

  const handleSubjectSelect = (subject: SubjectKey) => {
    startExam('study', {
      questionCount: 10,
      subjects: [subject],
      timeLimit: null,
    });
    router.push('/exam/study');
  };

  const handleStudyAll = () => {
    startExam('study', {
      questionCount: 15,
      subjects: [],
      timeLimit: null,
    });
    router.push('/exam/study');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Modo Estudo</Text>
          <Text style={styles.subtitle}>
            Escolhe uma matéria para estudar ou pratica todas juntas
          </Text>
        </View>

        {/* Study All Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.allCardWrapper}
        >
          <Card
            variant="gradient"
            gradientColors={[colors.ocean, colors.deepSea]}
            onPress={handleStudyAll}
            style={styles.allCard}
          >
            <View style={styles.allCardContent}>
              <View style={styles.allCardIcon}>
                <Ionicons name="library" size={32} color={colors.gold} />
              </View>
              <View style={styles.allCardText}>
                <Text style={styles.allCardTitle}>Todas as Matérias</Text>
                <Text style={styles.allCardSubtitle}>15 perguntas aleatórias de todos os temas</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color={colors.gold} />
            </View>
          </Card>
        </MotiView>

        {/* Subject Grid */}
        <Text style={styles.sectionTitle}>Por Matéria</Text>
        <View style={styles.subjectGrid}>
          {SUBJECT_KEYS.map((key, index) => {
            const subject = SUBJECTS[key];
            return (
              <MotiView
                key={key}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 300, delay: 100 + index * 80 }}
              >
                <Card
                  onPress={() => handleSubjectSelect(key)}
                  style={styles.subjectCard}
                >
                  <View style={[styles.subjectIconBg, { backgroundColor: `${subject.color}20` }]}>
                    <Ionicons name={subject.icon as any} size={28} color={subject.color} />
                  </View>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectDesc} numberOfLines={2}>{subject.description}</Text>
                  <View style={styles.subjectMeta}>
                    <Text style={[styles.subjectMinPass, { color: subject.color }]}>
                      Mín. {subject.minPass}%
                    </Text>
                  </View>
                </Card>
              </MotiView>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xxl,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
  },
  allCardWrapper: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  allCard: {
    padding: spacing.lg,
  },
  allCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  allCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.whiteAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allCardText: {
    flex: 1,
  },
  allCardTitle: {
    color: colors.white,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.lg,
    marginBottom: 4,
  },
  allCardSubtitle: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
  sectionTitle: {
    color: colors.sand,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  subjectGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  subjectCard: {
    padding: spacing.lg,
  },
  subjectIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  subjectName: {
    color: colors.white,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.lg,
    marginBottom: spacing.xs,
  },
  subjectDesc: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  subjectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectMinPass: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xs,
  },
});
