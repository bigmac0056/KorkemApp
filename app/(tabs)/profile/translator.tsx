import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguageContext } from '../../../contexts/LanguageContext';

export default function TranslatorScreen() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const { language } = useLanguageContext();
  const t = useTranslation();

  const handleTranslate = () => {
    if (!text.trim()) {
      Alert.alert(t.error, t.enterText);
      return;
    }

    // Здесь будет логика перевода
    Alert.alert(t.error, t.translationUnavailable);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.translator}</Text>

      <View style={styles.languageContainer}>
        <Text style={styles.languageLabel}>{t.fromLanguage}</Text>
        <Text style={styles.languageValue}>{language.toUpperCase()}</Text>
      </View>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder={t.enterText}
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <Pressable style={styles.button} onPress={handleTranslate}>
        <Text style={styles.buttonText}>{t.translate}</Text>
      </Pressable>

      {translatedText ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>{t.result}</Text>
          <Text style={styles.resultText}>{translatedText}</Text>
        </View>
      ) : null}
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
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  languageLabel: {
    fontSize: 16,
    color: '#666',
  },
  languageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 150,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});