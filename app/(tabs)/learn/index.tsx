import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguageContext } from '../../../contexts/LanguageContext';

export default function LearnScreen() {
  const router = useRouter();
  const t = useTranslation();
  const { language, setLanguage } = useLanguageContext();

  const languageLabels = {
    kz: 'kz',
    ru: 'ru',
    en: 'en',
  };

  return (
    <View style={styles.container}>
      <View style={styles.languageSelector}>
        {Object.entries(languageLabels).map(([lang, label]) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.languageButton,
              language === lang && styles.activeLanguage,
            ]}
            onPress={() => setLanguage(lang as 'ru' | 'kz' | 'en')}
          >
            <Text
              style={[
                styles.languageText,
                language === lang && styles.activeLanguageText,
              ]}
            >
              {label.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/learn/tests')}
        >
          <Text style={styles.menuText}>{t.tests}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/learn/cards')}
        >
          <Text style={styles.menuText}>{t.cards}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/learn/videos')}
        >
          <Text style={styles.menuText}>{t.videos}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/learn/mesk-revision')}
        >
          <Text style={styles.menuText}>{t.revisionMesk}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeLanguage: {
    backgroundColor: '#007AFF',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  activeLanguageText: {
    color: '#fff',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItem: {
    backgroundColor: '#1976D2',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});