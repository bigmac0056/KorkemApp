import { Stack } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';

export default function ProfileLayout() {
  const t = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t.profile,
        }}
      />
      <Stack.Screen
        name="favorites"
        options={{
          title: t.favorites,
        }}
      />
      <Stack.Screen
        name="translator"
        options={{
          title: t.translator,
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          title: t.contactUs,
        }}
      />
      <Stack.Screen
        name="my-profile"
        options={{
          title: t.myProfile,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: t.aboutApp,
        }}
      />
    </Stack>
  );
}