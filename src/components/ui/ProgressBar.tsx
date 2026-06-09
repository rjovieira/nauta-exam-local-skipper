import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { colors, borderRadius, spacing } from '@/utils/theme';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  color = colors.ocean,
  backgroundColor = colors.whiteAlpha10,
  height = 6,
  style,
  animated = true,
}: ProgressBarProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(progress, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(animatedProgress.value * 100, 0), 100)}%`,
  }));

  return (
    <View style={[styles.track, { backgroundColor, height, borderRadius: height / 2 }, style]}>
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color, borderRadius: height / 2 },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
