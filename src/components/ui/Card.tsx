import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '@/utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'glass' | 'gradient';
  gradientColors?: readonly [string, string, ...string[]];
  onPress?: () => void;
  animated?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Card({ children, style, variant = 'default', gradientColors, onPress, animated = true }: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (animated && onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (animated && onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const content = variant === 'gradient' ? (
    <LinearGradient
      colors={gradientColors || [colors.deepSea, colors.navy]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, styles.gradientCard, style]}
    >
      {children}
    </LinearGradient>
  ) : (
    <View style={[
      styles.card,
      variant === 'glass' ? styles.glassCard : styles.defaultCard,
      style
    ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return <Animated.View style={animated ? animatedStyle : undefined}>{content}</Animated.View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  defaultCard: {
    backgroundColor: colors.deepSea,
    borderWidth: 1,
    borderColor: colors.whiteAlpha10,
  },
  glassCard: {
    backgroundColor: colors.navyAlpha80,
    borderWidth: 1,
    borderColor: colors.whiteAlpha20,
  },
  gradientCard: {
    borderWidth: 0,
  },
});
