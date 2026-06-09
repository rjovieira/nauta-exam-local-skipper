export const colors = {
  navy: '#0A1628',
  deepSea: '#0F2847',
  ocean: '#1565C0',
  oceanLight: '#1E88E5',
  teal: '#00897B',
  tealLight: '#26A69A',
  coral: '#E74C3C',
  coralLight: '#EF5350',
  sand: '#F5E6D3',
  sandLight: '#FFF8F0',
  gold: '#F4A935',
  goldLight: '#FFB74D',
  foam: '#E0F2F1',
  rope: '#C4956A',
  sky: '#87CEEB',
  storm: '#37474F',
  stormLight: '#546E7A',
  white: '#FFFFFF',
  black: '#000000',
  // Transparency variants
  navyAlpha80: 'rgba(10, 22, 40, 0.8)',
  navyAlpha60: 'rgba(10, 22, 40, 0.6)',
  whiteAlpha10: 'rgba(255, 255, 255, 0.1)',
  whiteAlpha20: 'rgba(255, 255, 255, 0.2)',
  whiteAlpha60: 'rgba(255, 255, 255, 0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
};

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  headingRegular: 'Outfit_400Regular',
  headingSemibold: 'Outfit_600SemiBold',
  headingBold: 'Outfit_700Bold',
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
};
