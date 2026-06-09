import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize, fontFamily } from '@/utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const sizeStyles = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  };

  const textSizeStyles = {
    sm: { fontSize: fontSize.sm },
    md: { fontSize: fontSize.md },
    lg: { fontSize: fontSize.lg },
  };

  const inner = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? colors.ocean : colors.white} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[
            styles.text,
            textSizeStyles[size],
            variant === 'ghost' && styles.ghostText,
            variant === 'secondary' && styles.secondaryText,
            disabled && styles.disabledText,
            textStyle,
          ]}>
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[animatedStyle, style]}
      >
        <LinearGradient
          colors={disabled ? [colors.storm, colors.stormLight] : [colors.ocean, colors.oceanLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, sizeStyles[size], styles.primaryButton]}
        >
          {inner}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        animatedStyle,
        styles.button,
        sizeStyles[size],
        variant === 'secondary' && styles.secondaryButton,
        variant === 'ghost' && styles.ghostButton,
        variant === 'danger' && styles.dangerButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {inner}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryButton: {
    borderRadius: borderRadius.md,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.ocean,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: colors.coral,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    color: colors.white,
    fontFamily: fontFamily.semibold,
    textAlign: 'center',
  },
  ghostText: {
    color: colors.ocean,
  },
  secondaryText: {
    color: colors.ocean,
  },
  disabledText: {
    color: colors.stormLight,
  },
});
