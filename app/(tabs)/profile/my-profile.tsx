import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../contexts/AuthContext';
import { API_URL } from '../../../constants/config';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { language } = useLanguageContext();
  const t = useTranslation();
  const { userRole, logout } = useAuth();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found, redirecting to login');
        router.replace('/auth/login');
        return;
      }

      console.log('Loading user profile with token:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Profile response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        
        if (data.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setAvatar(data.user.avatar || null);
        } else {
          console.log('No user data in response');
          // Попробуем загрузить данные из локального хранилища
          const storedName = await AsyncStorage.getItem('userName');
          const storedEmail = await AsyncStorage.getItem('userEmail');
          if (storedName) setName(storedName);
          if (storedEmail) setEmail(storedEmail);
        }
      } else {
        const errorData = await response.text();
        console.log('Profile load error:', errorData);
        Alert.alert(t.error, t.profileLoadError);
        
        // Попробуем загрузить данные из локального хранилища
        const storedName = await AsyncStorage.getItem('userName');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert(t.error, t.profileLoadError);
      
      // Попробуем загрузить данные из локального хранилища
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
      } catch (storageError) {
        console.error('Error loading from storage:', storageError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/auth/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        Alert.alert(t.success, t.profileUpdateSuccess);
        setIsEditing(false);
      } else {
        const data = await response.json();
        Alert.alert(t.error, data.message || t.profileUpdateError);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t.error, t.profileUpdateError);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(t.error, t.imagePickError);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      // TODO: Upload image to server
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert(t.error, 'An error occurred during logout.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome name="user" size={40} color="#666" />
            </View>
          )}
          <View style={styles.editAvatarButton}>
            <FontAwesome name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        
        {userRole === 'developer' && (
          <View style={styles.developerBadge}>
            <FontAwesome name="code" size={16} color="#fff" />
            <Text style={styles.developerText}>Developer</Text>
          </View>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.fullName}</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={name}
            onChangeText={setName}
            editable={isEditing}
            placeholder={t.enterName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.email}</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={email}
            editable={false}
            keyboardType="email-address"
            placeholder={t.enterEmail}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{isEditing ? t.saveChanges : t.editProfile}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.buttonText, styles.logoutButtonText]}>{t.logout}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  developerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  developerText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
  },
}); 