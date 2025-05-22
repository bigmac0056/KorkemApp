import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import rawData from '@/data/tests.json';
import { TestItem } from '@/types/TestItem';
import TestQuiz from './test/TestQuiz'; 
import { useTranslation } from '@/hooks/useTranslation'; 

const levels = ['A1', 'A2', 'B1', 'B2'];
const categories = ['Фразеологизмы', 'Пословицы'];

export default function TestScreen() {
  const { t } = useTranslation(); 
  const [level, setLevel] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<TestItem[]>([]);

  const chooseLevel = (lvl: string) => {
    setLevel(lvl);
    setCategory(null);
  };

  const chooseCategory = (cat: string) => {
    if (!level) return;
    const data: TestItem[] = (rawData as TestItem[]).filter(
      item => item.category === cat && item.level === level
    );
    setFiltered(data);
    setCategory(cat);
  };

  const handleGoBack = () => {
    setLevel(null);
    setCategory(null);
    setFiltered([]);
  };

  if (!level) {
    return (
      <View style={styles.container}>
        <Text>{t.selectLevel}</Text>
        {levels.map(lvl => (
          <Pressable
            key={lvl}
            style={styles.levelButton}
            onPress={() => chooseLevel(lvl)}
          >
            <Text style={styles.levelText}>{lvl}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  if (!category) {
    return (
      <View style={styles.container}>
        <Text>{t.selectCategory}</Text>
        <View style={styles.row}>
          {categories.map(cat => (
            <Pressable
              key={cat}
              style={styles.categoryButton}
              onPress={() => chooseCategory(cat)}
            >
              <Text style={styles.levelText}>{cat}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return <TestQuiz testData={filtered} onGoBack={handleGoBack} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  levelButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 6,
    minWidth: 200, // для одинаковой ширины
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  levelText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    flexWrap: 'wrap',
  },
});