import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProfileScreen() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.profile}</Text>

      <Pressable style={styles.button} onPress={() => router.push('/profile/my-profile')}>
        <Text style={styles.buttonText}>{t.myProfile}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/profile/favorites')}>
        <Text style={styles.buttonText}>{t.favorites}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/profile/translator')}>
        <Text style={styles.buttonText}>{t.translator}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/profile/contact')}>
        <Text style={styles.buttonText}>{t.contactUs}</Text>
      </Pressable>

      <View style={styles.languageContainer}>
        <Text style={styles.languageLabel}>{t.chooseLanguage}</Text>
        <View style={styles.languageButtons}>
          <LangButton label="Қаз" selected={language === 'kz'} onPress={() => setLanguage('kz')} />
          <LangButton label="Рус" selected={language === 'ru'} onPress={() => setLanguage('ru')} />
          <LangButton label="Eng" selected={language === 'en'} onPress={() => setLanguage('en')} />
        </View>
      </View>
    </View>
  );
}

function LangButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.langButton, selected && styles.langButtonSelected]} onPress={onPress}>
      <Text style={styles.langButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  languageContainer: {
    marginTop: 20,
  },
  languageLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  langButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    opacity: 0.7,
  },
  langButtonSelected: {
    opacity: 1,
  },
  langButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});