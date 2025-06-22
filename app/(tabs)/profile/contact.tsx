import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactScreen() {
  const t = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = () => {
    if (!name || !email || !message) {
      Alert.alert(t.error, 'Пожалуйста, заполните все поля');
      return;
    }
    const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    Linking.openURL(`mailto:elubajernar291@gmail.com?subject=Contact Form&body=${encodeURIComponent(emailBody)}`)
      .catch(() => Alert.alert(t.error, 'Не удалось открыть почтовый клиент'));
  };

  const openEmail = () => {
    Linking.openURL('mailto:elubajernar291@gmail.com')
      .catch(() => Alert.alert(t.error, 'Не удалось открыть почтовый клиент'));
  };

  const openTelegram = () => {
    Linking.openURL('https://t.me/ernaar_0')
      .catch(() => Alert.alert(t.error, 'Не удалось открыть Telegram'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>{t.contactUs}</Text>
        <Text style={styles.subtitle}>
          Если у вас есть вопросы, предложения или вы нашли ошибку, свяжитесь с нами
        </Text>

        <View style={styles.form}>
      <TextInput
        style={styles.input}
            placeholder={t.fullName}
        value={name}
        onChangeText={setName}
      />
          <TextInput
            style={styles.input}
            placeholder={t.email}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
      <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Ваше сообщение"
        value={message}
        onChangeText={setMessage}
        multiline
      />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendEmail}>
            <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>ИЛИ</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.contactButton} onPress={openEmail}>
          <FontAwesome name="envelope" size={20} color="#fff" />
          <Text style={styles.buttonText}>Email: elubajernar291@gmail.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={openTelegram}>
          <FontAwesome name="telegram" size={20} color="#fff" />
          <Text style={styles.buttonText}>Telegram: @ernaar_0</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#dee2e6',
  },
  separatorText: {
    marginHorizontal: 15,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});