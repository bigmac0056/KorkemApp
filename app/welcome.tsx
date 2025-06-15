import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { language } = useLanguageContext();
  const t = useTranslation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#007AFF', '#00C6FF']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <FontAwesome name="graduation-cap" size={80} color="#fff" />
            <Text style={styles.appName}>KorkemApp</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>
              {language === 'ru' 
                ? 'Добро пожаловать в KorkemApp'
                : language === 'kz'
                ? 'KorkemApp-ке қош келдіңіз'
                : 'Welcome to KorkemApp'}
            </Text>
            <Text style={styles.description}>
              {language === 'ru'
                ? 'Изучайте казахский язык с помощью современных методов обучения'
                : language === 'kz'
                ? 'Қазақ тілін заманауи оқыту әдістерімен үйреніңіз'
                : 'Learn Kazakh language using modern teaching methods'}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => router.push('/auth/register')}
            >
              <Text style={styles.buttonText}>
                {language === 'ru'
                  ? 'Зарегистрироваться'
                  : language === 'kz'
                  ? 'Тіркелу'
                  : 'Register'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={[styles.buttonText, styles.loginButtonText]}>
                {language === 'ru'
                  ? 'Войти'
                  : language === 'kz'
                  ? 'Кіру'
                  : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  loginButtonText: {
    color: '#fff',
  },
}); 