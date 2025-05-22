import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';

export default function LearnHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const languageLabels = {
    kz: 'kz',
    ru: 'ru',
    en: 'eng',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.learn}</Text>

      <Pressable style={styles.button} onPress={() => router.push('/learn/tests')}>
        <Text style={styles.buttonText}>🧠 {t.tests}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/learn/cards')}>
        <Text style={styles.buttonText}>🃏 {t.cards}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/learn/videos')}>
        <Text style={styles.buttonText}>🎬 {t.videos}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/learn/revision')}>
        <Text style={styles.buttonText}>📚 {t.revisionMesk}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  languageText: {
    marginBottom: 30,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});