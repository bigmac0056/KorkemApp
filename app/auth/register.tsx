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

interface RegisterResponse {
  token: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { language } = useLanguageContext();
  const t = useTranslation();
  const { login } = useAuth();

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert(t.error, t.nameRequired);
      return false;
    }
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
    if (password.length < 6) {
      Alert.alert(t.error, t.passwordTooShort);
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert(t.error, t.passwordsDoNotMatch);
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<RegisterResponse>('/api/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data && response.status === 201) {
        await login(response.data.token, response.data.role);
        
        // Сохраняем данные пользователя в локальное хранилище
        if (response.data.user) {
          await AsyncStorage.setItem('userName', response.data.user.name || '');
          await AsyncStorage.setItem('userEmail', response.data.user.email || '');
        }
        
        router.push('/(tabs)/home');
      } else {
        Alert.alert(t.error, response.error || t.registrationError);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(t.error, error instanceof Error ? error.message : t.registrationError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <FontAwesome name="user-plus" size={80} color="#007AFF" />
          <Text style={styles.title}>{t.createAccount}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.fullName}
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

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

          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.confirmPassword}
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>{t.register}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>{t.alreadyHaveAccount}</Text>
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
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  eyeButton: {
    padding: 5,
  },
}); 