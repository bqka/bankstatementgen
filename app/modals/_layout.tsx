import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', headerShown: false }}>
      <Stack.Screen name="ocr-import" options={{ title: 'Import Statement' }} />
      <Stack.Screen name="pdf-preview" options={{ title: 'Preview PDF' }} />
    </Stack>
  );
}
