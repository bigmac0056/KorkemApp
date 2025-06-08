import { Stack } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';

export default function LearnLayout() {
  const t = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t.learn,
        }}
      />
      <Stack.Screen
        name="tests"
        options={{
          title: t.tests,
        }}
      />
      <Stack.Screen
        name="cards"
        options={{
          title: t.cards,
        }}
      />
      <Stack.Screen
        name="videos"
        options={{
          title: t.videos,
        }}
      />
      <Stack.Screen
        name="mesk-revision"
        options={{
          title: t.revisionMesk,
        }}
      />
    </Stack>
  );
}