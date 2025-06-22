import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginResponse {
  token: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { language } = useLanguageContext();
  const t = useTranslation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('[LOGIN] Sending login request:', email, password);
      const response = await apiClient.post<LoginResponse>('/api/auth/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      console.log('[LOGIN] Response status:', response.status);
      if (response.data && response.status === 200) {
        console.log('[LOGIN] Login success:', response.data);
        await login(response.data.token, response.data.role);
        console.log('[LOGIN] AuthContext login called, navigating to home...');
        
        // Сохраняем данные пользователя в локальное хранилище
        if (response.data.user) {
          await AsyncStorage.setItem('userName', response.data.user.name || '');
          await AsyncStorage.setItem('userEmail', response.data.user.email || '');
        }
        
        router.replace('/(tabs)/home');
      } else {
        const errorData = response.error || t.loginError;
        console.log('[LOGIN] Login failed:', errorData);
        Alert.alert(t.error, errorData);
      }
    } catch (error) {
      console.error('[LOGIN] Login error:', error);
      Alert.alert(t.error, t.loginError);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert(t.error, t.emailRequired);
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert(t.error, t.invalidEmail);
      return false;
    }
    if (!password) {
      Alert.alert(t.error, t.passwordRequired);
      return false;
    }
    return true;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <FontAwesome name="user-circle" size={80} color="#007AFF" />
          <Text style={styles.title}>{t.welcomeBack}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.email}
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.password}
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
            <Text style={styles.loginButtonText}>{t.login}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/auth/register')}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>{t.createAccount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputPlaceholder: {
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  eyeButton: {
    padding: 10,
  },
}); 