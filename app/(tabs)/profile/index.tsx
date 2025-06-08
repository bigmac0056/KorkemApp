import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { language, setLanguage } = useLanguageContext();
  const t = useTranslation();

  return (
    <View style={styles.container}>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.currentLanguage}</Text>
        <View style={styles.languageButtons}>
          <TouchableOpacity
            style={[styles.languageButton, language === 'ru' && styles.activeLanguage]}
            onPress={() => setLanguage('ru')}
          >
            <Text style={[styles.languageText, language === 'ru' && styles.activeLanguageText]}>Русский</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.languageButton, language === 'kz' && styles.activeLanguage]}
            onPress={() => setLanguage('kz')}
          >
            <Text style={[styles.languageText, language === 'kz' && styles.activeLanguageText]}>Қазақша</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.languageButton, language === 'en' && styles.activeLanguage]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.languageText, language === 'en' && styles.activeLanguageText]}>English</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/favorites')}>
          <FontAwesome name="star" size={24} color="#007AFF" />
          <Text style={styles.menuText}>{t.favorites}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/translator')}>
          <FontAwesome name="language" size={24} color="#007AFF" />
          <Text style={styles.menuText}>{t.translator}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/contact')}>
          <FontAwesome name="envelope" size={24} color="#007AFF" />
          <Text style={styles.menuText}>{t.contactUs}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeLanguage: {
    backgroundColor: '#007AFF',
  },
  languageText: {
    color: '#007AFF',
    fontSize: 16,
  },
  activeLanguageText: {
    color: '#fff',
  },
  menuSection: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
});