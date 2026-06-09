import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '@/components/ui/Card';
import WaveBackground from '@/components/theme/WaveBackground';
import { useExam } from '@/contexts/ExamContext';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

const EXAM_MODES = [
  {
    id: 'real' as const,
    title: 'Exame Real',
    subtitle: 'Simulação oficial do exame',
    description: '30 perguntas • 180 minutos • Sem feedback',
    icon: 'compass' as const,
    gradient: [colors.ocean, '#1A237E'] as const,
    iconColor: colors.sky,
  },
  {
    id: 'study' as const,
    title: 'Modo Estudo',
    subtitle: 'Aprende ao teu ritmo',
    description: 'Feedback imediato • Explicações detalhadas',
    icon: 'book' as const,
    gradient: [colors.teal, '#004D40'] as const,
    iconColor: colors.foam,
  },
  {
    id: 'custom' as const,
    title: 'Exame Personalizado',
    subtitle: 'Configura à tua medida',
    description: 'Escolhe matérias, nº de perguntas e tempo',
    icon: 'settings' as const,
    gradient: [colors.gold, '#E65100'] as const,
    iconColor: colors.sandLight,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { startExam } = useExam();
  const insets = useSafeAreaInsets();

  const handleModeSelect = (mode: 'real' | 'study' | 'custom') => {
    if (mode === 'custom') {
      router.push('/exam/setup');
    } else {
      startExam(mode);
      router.push(`/exam/${mode}`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.anchorBadge}>
              <Ionicons name="boat" size={28} color={colors.gold} />
            </View>
            <Text style={styles.title}>Carta de{'\n'}Patrão Local</Text>
            <Text style={styles.subtitle}>
              Preparação para o exame de navegação de recreio
            </Text>
          </View>
          <WaveBackground height={120} />
        </MotiView>

        {/* Mode Selection Cards */}
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionTitle}>Escolhe o teu modo</Text>
          {EXAM_MODES.map((mode, index) => (
            <MotiView
              key={mode.id}
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: 'timing',
                duration: 400,
                delay: 200 + index * 150,
              }}
            >
              <Card
                variant="gradient"
                gradientColors={mode.gradient}
                onPress={() => handleModeSelect(mode.id)}
                style={styles.modeCard}
              >
                <View style={styles.modeCardContent}>
                  <View style={[styles.modeIconContainer, { backgroundColor: `${mode.iconColor}20` }]}>
                    <Ionicons name={mode.icon} size={32} color={mode.iconColor} />
                  </View>
                  <View style={styles.modeTextContainer}>
                    <Text style={styles.modeTitle}>{mode.title}</Text>
                    <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                    <Text style={styles.modeDescription}>{mode.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={colors.whiteAlpha60} />
                </View>
              </Card>
            </MotiView>
          ))}
        </View>

        {/* Quick Stats */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 700 }}
          style={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <Ionicons name="help-circle-outline" size={24} color={colors.ocean} />
            <Text style={styles.statNumber}>30</Text>
            <Text style={styles.statLabel}>Perguntas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Ionicons name="layers-outline" size={24} color={colors.teal} />
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Matérias</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={24} color={colors.gold} />
            <Text style={styles.statNumber}>60%</Text>
            <Text style={styles.statLabel}>Mín. Aprovação</Text>
          </View>
        </MotiView>
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
    position: 'relative',
    overflow: 'hidden',
    minHeight: 220,
  },
  headerContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    zIndex: 1,
  },
  anchorBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.whiteAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gold + '30',
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.hero,
    lineHeight: fontSize.hero * 1.15,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.4,
  },
  cardsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.sand,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.xl,
    marginBottom: spacing.xs,
  },
  modeCard: {
    padding: spacing.lg,
  },
  modeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  modeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    color: colors.white,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.lg,
    marginBottom: 2,
  },
  modeSubtitle: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    marginBottom: 4,
  },
  modeDescription: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.deepSea,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.whiteAlpha10,
  },
  statCard: {
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
    textAlign: 'center',
  },
});
