import { Stack } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';

export default function HomeLayout() {
  const t = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t.home,
        }}
      />
      <Stack.Screen
        name="phrases"
        options={{
          title: t.phrases,
        }}
      />
      <Stack.Screen
        name="proverbs"
        options={{
          title: t.proverbs,
        }}
      />
      <Stack.Screen
        name="mesk-preparation"
        options={{
          title: t.prepareMesk,
        }}
      />
    </Stack>
  );
}