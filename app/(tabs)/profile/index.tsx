import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { language, setLanguage } = useLanguageContext();
  const t = useTranslation();
  const { logout, userRole } = useAuth();

  const handleClearCache = async () => {
    try {
      // Сохраняем данные авторизации
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      
      // Очищаем все данные
      await AsyncStorage.clear();
      
      // Восстанавливаем данные авторизации
      if (token) await AsyncStorage.setItem('userToken', token);
      if (role) await AsyncStorage.setItem('userRole', role);
      
      Alert.alert(t.success, t.cacheCleared);
    } catch (error) {
      Alert.alert(t.error, t.cacheClearError);
    }
  };

  const handleShareApp = () => {
    // TODO: Implement share functionality
    Alert.alert(t.comingSoon, t.shareFeatureComing);
  };

  const handleRateApp = () => {
    // TODO: Implement app rating functionality
    Alert.alert(t.comingSoon, t.ratingFeatureComing);
  };

  const handleLogout = async () => {
    Alert.alert(
      t.logout,
      'Вы уверены, что хотите выйти?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(t.error, t.logoutError);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {userRole === 'developer' && (
        <View style={styles.developerBadge}>
          <FontAwesome name="code" size={20} color="#fff" />
          <Text style={styles.developerText}>Developer</Text>
        </View>
      )}
      
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
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/my-profile')}>
          <FontAwesome name="user" size={24} color="#007AFF" />
          <Text style={styles.menuText}>{t.myProfile}</Text>
        </TouchableOpacity>

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

        <TouchableOpacity style={styles.menuItem} onPress={handleShareApp}>
          <FontAwesome name="share-alt" size={24} color="#007AFF" />
          <Text style={styles.menuText}>{t.shareApp}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleRateApp}>
          <FontAwesome name="star-half-o" size={24} color="#007AFF" />
          <Text style={styles.menuText}>{t.rateApp}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
          <FontAwesome name="trash" size={24} color="#007AFF" />
          <Text style={styles.menuText}>{t.clearCache}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/about')}>
          <FontAwesome name="info-circle" size={24} color="#007AFF" />
          <Text style={styles.menuText}>{t.aboutApp}</Text>
        </TouchableOpacity>

        {userRole === 'developer' && (
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/server-test')}>
            <FontAwesome name="server" size={24} color="#007AFF" />
            <Text style={styles.menuText}>Server Test</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={24} color="#FF3B30" />
          <Text style={[styles.menuText, styles.logoutText]}>{t.logout}</Text>
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
  developerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  developerText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
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
  logoutButton: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3B30',
  },
});