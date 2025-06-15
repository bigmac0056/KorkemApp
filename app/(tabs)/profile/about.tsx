import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesome } from '@expo/vector-icons';

export default function AboutScreen() {
  const t = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Korkem App</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.aboutApp}</Text>
        <Text style={styles.description}>
          Korkem App - это образовательное приложение для подготовки к МЭСК, изучения казахского языка и культуры.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Разработчики</Text>
        <Text style={styles.description}>
          Разработано учеником Назарбаев интеллектуальной школы
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Контакты</Text>
        <Text style={styles.description}>
          По всем вопросам обращайтесь:
          {'\n'}Email: support@korkem.app
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
}); 