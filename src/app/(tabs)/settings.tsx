import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import Card from '@/components/ui/Card';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Definições</Text>
        </View>

        {/* About Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Card style={styles.aboutCard}>
            <View style={styles.aboutIcon}>
              <Ionicons name="boat" size={40} color={colors.gold} />
            </View>
            <Text style={styles.appName}>Carta de Patrão Local</Text>
            <Text style={styles.appVersion}>Versão 1.0.0</Text>
            <Text style={styles.appDescription}>
              Aplicação de simulação de exame para a obtenção da Carta de Patrão Local em Portugal. 
              Pratica e prepara-te para o exame oficial da DGRM.
            </Text>
          </Card>
        </MotiView>

        {/* Info Section */}
        <Text style={styles.sectionTitle}>Informação</Text>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
        >
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={22} color={colors.ocean} />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Sobre o Exame</Text>
                <Text style={styles.infoDescription}>
                  O exame de Patrão Local é composto por uma prova teórica escrita com duração máxima de 180 minutos. 
                  A aprovação requer uma pontuação global superior a 60%, com mínimos específicos por matéria.
                </Text>
              </View>
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
        >
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="navigate-outline" size={22} color={colors.teal} />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Habilitação</Text>
                <Text style={styles.infoDescription}>
                  A Carta de Patrão Local permite comandar embarcações de recreio até 6 milhas da costa 
                  e 25 milhas de um porto de abrigo, em navegação diurna e noturna.
                </Text>
              </View>
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.gold} />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Mínimos por Matéria</Text>
                <Text style={styles.infoDescription}>
                  RIEAM: ≥75% • Navegação: ≥75%{'\n'}
                  Comunicações: ≥60% • Segurança: ≥60%
                </Text>
              </View>
            </View>
          </Card>
        </MotiView>

        {/* Legal */}
        <Text style={styles.disclaimer}>
          Esta aplicação é um recurso de estudo e não é afiliada à DGRM. 
          As perguntas são ilustrativas e podem não refletir o exame oficial.
        </Text>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xxl,
  },
  aboutCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  aboutIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.whiteAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gold + '30',
  },
  appName: {
    color: colors.white,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xl,
    marginBottom: spacing.xs,
  },
  appVersion: {
    color: colors.stormLight,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  appDescription: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: fontSize.sm * 1.5,
  },
  sectionTitle: {
    color: colors.sand,
    fontFamily: fontFamily.headingSemibold,
    fontSize: fontSize.lg,
    marginBottom: spacing.md,
  },
  infoCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    color: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    marginBottom: spacing.xs,
  },
  infoDescription: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  disclaimer: {
    color: colors.storm,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: fontSize.xs * 1.5,
    paddingHorizontal: spacing.lg,
  },
});
