import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const languageLabels = {
    kz: 'kz',
    ru: 'ru',
    en: 'eng',
  };
  const { language, setLanguage } = useLanguage();

  const cycleLanguage = () => {
    const next = language === 'kz' ? 'ru' : language === 'ru' ? 'en' : 'kz';
    setLanguage(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.home}</Text>

      <Pressable onPress={cycleLanguage}>
        <Text style={styles.languageText}>
          🌐 {t.currentLanguage}: {languageLabels[language]}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/home/phrases')}>
        <Text style={styles.buttonText}>{t.phrases}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/home/proverbs')}>
        <Text style={styles.buttonText}>{t.proverbs}</Text>
      </Pressable>

      
      <Pressable style={styles.button} onPress={() => router.push('/home/mesk')}>
        <Text style={styles.buttonText}>📘 {t.prepareMesk}</Text>
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  languageText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
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
});