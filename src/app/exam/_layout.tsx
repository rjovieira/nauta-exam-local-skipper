import { Stack } from 'expo-router';
import { colors } from '@/utils/theme';

export default function ExamLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.navy },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="setup" />
      <Stack.Screen name="[mode]" options={{ gestureEnabled: false }} />
      <Stack.Screen name="results" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
