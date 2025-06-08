import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { TestItem } from '../../../../types/TestItem';
import { useTranslation } from '../../../../hooks/useTranslation';

type Props = {
  testData: TestItem[];
  onGoBack: () => void;
};

export default function TestQuiz({ testData, onGoBack }: Props) {
  const { t } = useTranslation();

  if (!testData || testData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>
          {t.noTestsAvailable || 'Нет доступных тестов для выбранной категории и уровня.'}
        </Text>
        <Pressable style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backText}>{t.goBack || 'Вернуться назад'}</Text>
        </Pressable>
      </View>
    );
  }
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = testData[index];

  const handleOptionPress = (i: number) => {
    if (showAnswer) return;
    setSelected(i);
    setShowAnswer(true);
    if (i === current.correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    const next = index + 1;
    if (next >= testData.length) setFinished(true);
    else {
      setIndex(next);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultTitle}>{t.result || 'Результат'}</Text>
        <Text style={styles.resultText}>
          {t.yourScore || 'Ваш счёт'}: {score} / {testData.length}
        </Text>

        <Pressable style={styles.nextButton} onPress={handleRestart}>
          <Text style={styles.nextText}>{t.tryAgain || 'Попробовать снова'}</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backText}>{t.backToLevels || 'Вернуться к выбору уровня'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{index + 1}. {current.question}</Text>
      {current.options.map((opt, i) => {
        let bg = '#eee';
        if (showAnswer) {
          if (i === current.correctIndex) bg = '#4CAF50';
          else if (i === selected) bg = '#F44336';
        }
        return (
          <Pressable
            key={i}
            style={[styles.option, { backgroundColor: bg }]}
            onPress={() => handleOptionPress(i)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </Pressable>
        );
      })}
      {showAnswer && (
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>{t.next || 'Следующий'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  question: { fontSize: 20, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  option: { padding: 14, borderRadius: 10, marginBottom: 10 },
  optionText: { fontSize: 16, color: '#000' },
  nextButton: { marginTop: 20, backgroundColor: '#1976D2', borderRadius: 10, padding: 14 },
  nextText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
  resultTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  resultText: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  backButton: {
    marginTop: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
    padding: 14,
  },
  backText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: '600',
  },
});