import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExam, ExamMode } from '@/contexts/ExamContext';
import ExamHeader from '@/components/exam/ExamHeader';
import QuestionCard from '@/components/exam/QuestionCard';
import AnswerOption from '@/components/exam/AnswerOption';
import FeedbackCard from '@/components/exam/FeedbackCard';
import Button from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

export default function ExamScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const insets = useSafeAreaInsets();
  const {
    state,
    currentQuestion,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    finishExam,
    resetExam,
    progress,
    answeredCount,
  } = useExam();

  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [finishModalVisible, setFinishModalVisible] = useState(false);

  const examMode = (mode || 'real') as ExamMode;
  const isStudyMode = examMode === 'study';
  const currentAnswer = state.answers[state.currentIndex];
  const hasAnswered = currentAnswer !== undefined;
  const isLastQuestion = state.currentIndex === state.questions.length - 1;

  const handleAnswer = (answerIndex: number) => {
    if (isStudyMode && hasAnswered) return; // Already answered in study mode
    answerQuestion(state.currentIndex, answerIndex);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleFinish();
    } else {
      nextQuestion();
    }
  };

  const handleFinish = async () => {
    if (!isStudyMode && answeredCount < state.questions.length) {
      setFinishModalVisible(true);
    } else {
      await finishExam();
      router.replace('/exam/results');
    }
  };

  const handleClose = () => {
    setExitModalVisible(true);
  };

  if (!currentQuestion || state.questions.length === 0) {
    return (
      <View style={[styles.container, styles.errorContainer, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.coral} />
        <Text style={styles.errorText}>Nenhuma pergunta disponível</Text>
        <Button
          title="Voltar"
          onPress={() => {
            resetExam();
            if (Platform.OS === 'web') {
              router.replace('/');
            } else {
              router.dismissAll();
            }
          }}
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ExamHeader
        currentIndex={state.currentIndex}
        totalQuestions={state.questions.length}
        timeRemaining={state.timeRemaining}
        answeredCount={answeredCount}
        onClose={handleClose}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard
          question={currentQuestion}
          index={state.currentIndex}
          total={state.questions.length}
        />

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <AnswerOption
              key={index}
              text={option}
              index={index}
              isSelected={currentAnswer === index}
              isCorrect={index === currentQuestion.correctAnswer}
              showResult={isStudyMode && hasAnswered}
              onPress={() => handleAnswer(index)}
              disabled={isStudyMode && hasAnswered}
            />
          ))}
        </View>

        {/* Study mode feedback */}
        {isStudyMode && hasAnswered && (
          <FeedbackCard
            isCorrect={currentAnswer === currentQuestion.correctAnswer}
            explanation={currentQuestion.explanation}
          />
        )}
      </ScrollView>

      {/* Navigation Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        {isStudyMode ? (
          <View style={styles.studyNav}>
            <Button
              title="Anterior"
              variant="ghost"
              size="md"
              onPress={prevQuestion}
              disabled={state.currentIndex === 0}
              icon={<Ionicons name="chevron-back" size={20} color={state.currentIndex === 0 ? colors.storm : colors.ocean} />}
            />
            <Text style={styles.navIndicator}>
              {state.currentIndex + 1} / {state.questions.length}
            </Text>
            {isLastQuestion ? (
              <Button
                title="Resultados"
                variant="primary"
                size="md"
                onPress={handleFinish}
                disabled={!hasAnswered}
                icon={<Ionicons name="flag" size={20} color={colors.white} />}
              />
            ) : (
              <Button
                title="Seguinte"
                variant="primary"
                size="md"
                onPress={handleNext}
                disabled={!hasAnswered}
                icon={<Ionicons name="chevron-forward" size={20} color={colors.white} />}
              />
            )}
          </View>
        ) : (
          <View style={styles.examNav}>
            <View style={styles.examNavLeft}>
              {state.currentIndex > 0 && (
                <Button
                  title="Anterior"
                  variant="ghost"
                  size="md"
                  onPress={prevQuestion}
                  icon={<Ionicons name="chevron-back" size={20} color={colors.ocean} />}
                />
              )}
            </View>
            {isLastQuestion ? (
              <Button
                title="Terminar Exame"
                variant="primary"
                size="md"
                onPress={handleFinish}
                icon={<Ionicons name="flag" size={20} color={colors.white} />}
              />
            ) : (
              <Button
                title="Seguinte"
                variant="primary"
                size="md"
                onPress={handleNext}
                icon={<Ionicons name="chevron-forward" size={20} color={colors.white} />}
              />
            )}
          </View>
        )}
      </View>

      {/* Custom Exit Modal */}
      <Modal
        visible={exitModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setExitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning-outline" size={28} color={colors.gold} />
              <Text style={styles.modalTitle}>Sair do Exame?</Text>
            </View>
            <Text style={styles.modalMessage}>
              O teu progresso será perdido. Tens a certeza que queres sair?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => setExitModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title="Sair"
                variant="danger"
                onPress={() => {
                  setExitModalVisible(false);
                  resetExam();
                  if (Platform.OS === 'web') {
                    router.replace('/');
                  } else {
                    router.dismissAll();
                  }
                }}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Finish Modal */}
      <Modal
        visible={finishModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFinishModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="flag-outline" size={28} color={colors.ocean} />
              <Text style={styles.modalTitle}>Terminar Exame?</Text>
            </View>
            <Text style={styles.modalMessage}>
              {`Respondeste a ${answeredCount} de ${state.questions.length} perguntas. Tens a certeza que queres terminar?`}
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => setFinishModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title="Terminar"
                variant="primary"
                onPress={async () => {
                  setFinishModalVisible(false);
                  await finishExam();
                  router.replace('/exam/results');
                }}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  errorContainer: {
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
    paddingHorizontal: spacing.md,
    paddingBottom: 120,
    gap: spacing.md,
  },
  optionsContainer: {
    marginTop: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.navy,
    borderTopWidth: 1,
    borderTopColor: colors.whiteAlpha10,
  },
  studyNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navIndicator: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
  examNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  examNavLeft: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 11, 20, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.deepSea,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.whiteAlpha10,
    gap: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalTitle: {
    color: colors.white,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xl,
  },
  modalMessage: {
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  modalButton: {
    minWidth: 100,
  },
});
