import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from '@/hooks/useTranslation';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'fr', label: 'Français' },
];

export default function TranslatorScreen() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ru');
  const { t } = useTranslation();

  // Показать уведомление при заходе на экран
  useEffect(() => {
    Alert.alert(
      'Переводчик недоступен',
      'Функция перевода временно отключена. Ожидается в следующем обновлении.',
      [{ text: 'OK' }]
    );
  }, []);

  const translate = async () => {
    Keyboard.dismiss();

    setResult(
      t.translationUnavailable || 'Переводчик временно недоступен.'
    );
  };

  const swapLanguages = () => {
    if (sourceLang === targetLang) return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setInput(result);
      setResult('');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>🌐 {t.translator}</Text>

      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>{t.fromLanguage}:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={sourceLang}
              onValueChange={(value) => setSourceLang(value)}
              style={styles.picker}
            >
              {languages.map((lang) => (
                <Picker.Item key={lang.code} label={lang.label} value={lang.code} />
              ))}
            </Picker>
          </View>
        </View>

        <Pressable onPress={swapLanguages} style={styles.swapButton}>
          <Text style={styles.swapText}>⇄</Text>
        </Pressable>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>{t.toLanguage}:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={targetLang}
              onValueChange={(value) => setTargetLang(value)}
              style={styles.picker}
            >
              {languages.map((lang) => (
                <Picker.Item key={lang.code} label={lang.label} value={lang.code} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder={t.enterText}
        placeholderTextColor="#666"
        value={input}
        onChangeText={setInput}
        multiline
      />

      <Pressable style={styles.button} onPress={translate}>
        <Text style={styles.buttonText}>{t.translate}</Text>
      </Pressable>

      {!!result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  pickerContainer: {
    flex: 4,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  swapButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapText: {
    fontSize: 28,
    color: '#1E88E5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    fontSize: 16,
    color: '#000',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  resultBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});