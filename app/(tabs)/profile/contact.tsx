import { View, Text, TextInput, Pressable, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import * as Linking from 'expo-linking';
import { useTranslation } from '../../../hooks/useTranslation';

export default function ContactScreen() {
  const t = useTranslation();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) {
      Alert.alert(t.error, t.fillMessage);
      return;
    }

    const emailBody = `Name: ${name}\n\nMessage: ${message}`;
    Linking.openURL(`mailto:support@korkemapp.com?subject=Contact Form&body=${encodeURIComponent(emailBody)}`)
      .catch(() => {
        Alert.alert(t.error, t.cannotSend);
      });
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@korkemapp.com');
  };

  const handleTelegramPress = () => {
    Linking.openURL('https://t.me/korkemapp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.contactUs}</Text>

      <TextInput
        placeholder={t.yourName}
        placeholderTextColor="#555"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder={t.yourMessage}
        placeholderTextColor="#555"
        style={[styles.input, styles.textArea]}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={5}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>{t.send}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleEmailPress}>
          <Text style={styles.buttonText}>Email: support@korkemapp.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTelegramPress}>
          <Text style={styles.buttonText}>Telegram: @korkemapp</Text>
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
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});