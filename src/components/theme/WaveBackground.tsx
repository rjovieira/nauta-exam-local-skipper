import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { colors } from '@/utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WaveBackgroundProps {
  height?: number;
  color1?: string;
  color2?: string;
}

export default function WaveBackground({
  height = 200,
  color1 = colors.ocean,
  color2 = colors.deepSea,
}: WaveBackgroundProps) {
  return (
    <View style={[styles.container, { height }]}>
      <Svg
        width={SCREEN_WIDTH}
        height={height}
        viewBox={`0 0 ${SCREEN_WIDTH} ${height}`}
        preserveAspectRatio="none"
      >
        <Defs>
          <SvgGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color1} stopOpacity="0.3" />
            <Stop offset="1" stopColor={color2} stopOpacity="0.1" />
          </SvgGradient>
        </Defs>
        <Path
          d={`M0,${height * 0.4} C${SCREEN_WIDTH * 0.25},${height * 0.2} ${SCREEN_WIDTH * 0.5},${height * 0.6} ${SCREEN_WIDTH},${height * 0.35} L${SCREEN_WIDTH},${height} L0,${height} Z`}
          fill="url(#waveGrad)"
        />
        <Path
          d={`M0,${height * 0.6} C${SCREEN_WIDTH * 0.3},${height * 0.45} ${SCREEN_WIDTH * 0.6},${height * 0.75} ${SCREEN_WIDTH},${height * 0.55} L${SCREEN_WIDTH},${height} L0,${height} Z`}
          fill={color1}
          opacity={0.15}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
