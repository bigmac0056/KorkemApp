import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import testsData from '../../../data/tests.json';

type TestItem = {
  id: number;
  level: string;
  category: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
};

export default function TestScreen() {
  const t = useTranslation();
  const { language } = useLanguageContext();
  const [level, setLevel] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<TestItem[]>([]);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const categories = ['Grammar', 'Vocabulary', 'Reading', 'Listening'];

  const handleLevelSelect = (selectedLevel: string) => {
    setLevel(selectedLevel);
    setCategory(null);
    const filteredTests = testsData.map((test, index) => ({
      id: index + 1,
      level: test.level,
      category: test.category,
      questions: [{
        question: test.question,
        options: test.options,
        correctAnswer: test.correctIndex
      }]
    })).filter(test => test.level === selectedLevel);
    setFiltered(filteredTests);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    const filteredTests = testsData.map((test, index) => ({
      id: index + 1,
      level: test.level,
      category: test.category,
      questions: [{
        question: test.question,
        options: test.options,
        correctAnswer: test.correctIndex
      }]
    })).filter(test => test.level === level && test.category === selectedCategory);
    setFiltered(filteredTests);
  };

  const startTest = (test: TestItem) => {
    Alert.alert(
      t.selectLevel,
      `${t.selectCategory}: ${test.category}`,
      [
        {
          text: t.goBack,
          style: 'cancel',
        },
        {
          text: t.next,
          onPress: () => {
            // Здесь будет логика начала теста
            Alert.alert(t.noTestsAvailable);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t.tests}</Text>

      {!level ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.selectLevel}</Text>
          <View style={styles.buttonGrid}>
            {levels.map((lvl) => (
              <Pressable
                key={lvl}
                style={styles.button}
                onPress={() => handleLevelSelect(lvl)}
              >
                <Text style={styles.buttonText}>{lvl}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : !category ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.selectCategory}</Text>
          <View style={styles.buttonGrid}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={styles.button}
                onPress={() => handleCategorySelect(cat)}
              >
                <Text style={styles.buttonText}>{cat}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={[styles.button, styles.backButton]}
            onPress={() => setLevel(null)}
          >
            <Text style={styles.buttonText}>{t.backToLevels}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.section}>
          {filtered.length > 0 ? (
            filtered.map((test) => (
              <Pressable
                key={test.id}
                style={styles.testCard}
                onPress={() => startTest(test)}
              >
                <Text style={styles.testTitle}>
                  {test.category} - {test.level}
                </Text>
                <Text style={styles.testInfo}>
                  {test.questions.length} {t.questions}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.emptyText}>{t.noTestsAvailable}</Text>
          )}
          <Pressable
            style={[styles.button, styles.backButton]}
            onPress={() => setCategory(null)}
          >
            <Text style={styles.buttonText}>{t.goBack}</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#666',
    marginTop: 15,
  },
  testCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  testInfo: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
});