import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontFamily, borderRadius } from '@/utils/theme';

interface AnswerOptionProps {
  text: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function AnswerOption({
  text,
  index,
  isSelected,
  isCorrect,
  showResult = false,
  onPress,
  disabled = false,
}: AnswerOptionProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const getBackgroundColor = () => {
    if (showResult) {
      if (isCorrect) return 'rgba(0, 137, 123, 0.15)';
      if (isSelected && !isCorrect) return 'rgba(231, 76, 60, 0.15)';
    }
    if (isSelected) return 'rgba(21, 101, 192, 0.2)';
    return colors.whiteAlpha10;
  };

  const getBorderColor = () => {
    if (showResult) {
      if (isCorrect) return colors.teal;
      if (isSelected && !isCorrect) return colors.coral;
    }
    if (isSelected) return colors.ocean;
    return 'transparent';
  };

  const getIcon = () => {
    if (!showResult) return null;
    if (isCorrect) return <Ionicons name="checkmark-circle" size={22} color={colors.teal} />;
    if (isSelected && !isCorrect) return <Ionicons name="close-circle" size={22} color={colors.coral} />;
    return null;
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      <Text style={[
        styles.letter,
        isSelected && !showResult && styles.letterSelected,
        showResult && isCorrect && styles.letterCorrect,
        showResult && isSelected && !isCorrect && styles.letterWrong,
      ]}>
        {OPTION_LETTERS[index]}
      </Text>
      <Text style={[
        styles.text,
        isSelected && !showResult && styles.textSelected,
        showResult && isCorrect && styles.textCorrect,
        showResult && isSelected && !isCorrect && styles.textWrong,
      ]}>
        {text}
      </Text>
      {getIcon()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  letter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.whiteAlpha10,
    color: colors.whiteAlpha60,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 28,
    overflow: 'hidden',
  },
  letterSelected: {
    backgroundColor: colors.ocean,
    color: colors.white,
  },
  letterCorrect: {
    backgroundColor: colors.teal,
    color: colors.white,
  },
  letterWrong: {
    backgroundColor: colors.coral,
    color: colors.white,
  },
  text: {
    flex: 1,
    color: colors.sand,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.4,
  },
  textSelected: {
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
  textCorrect: {
    color: colors.tealLight,
  },
  textWrong: {
    color: colors.coralLight,
  },
});
