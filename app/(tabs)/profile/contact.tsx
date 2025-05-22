import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import * as Linking from 'expo-linking';
import { useTranslation } from '@/hooks/useTranslation';

export default function ContactScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) {
      Alert.alert(t.error || 'Ошибка', t.fillMessage || 'Пожалуйста, введите сообщение.');
      return;
    }

    const subject = `KorkemApp feedback from ${name || 'User'}`;
    const body = encodeURIComponent(message);
    const email = 'elubajernar291@gmail.com';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;

    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(t.error || 'Ошибка', t.cannotSend || 'Не удалось открыть почтовый клиент.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.contactUs || 'Связаться с нами'}</Text>

      <TextInput
      placeholder={t.yourName || 'Ваше имя'}
      placeholderTextColor="#555"
      style={styles.input}
      value={name}
      onChangeText={setName}
    />

    <TextInput
      placeholder={t.yourMessage || 'Ваше сообщение'}
      placeholderTextColor="#555"
      style={[styles.input, styles.textArea]}
      value={message}
      onChangeText={setMessage}
      multiline
      numberOfLines={5}
    />

      <Pressable style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>{t.send || 'Отправить'}</Text>
      </Pressable>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1976D2',
    borderRadius: 10,
    paddingVertical: 14,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});