import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function MeskScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📘 {t.prepareMesk || 'Подготовка к МЭСКу'}</Text>
      <Text style={styles.text}>
        Здесь будет раздел для подготовки к МЭСКу. Вы сможете пройти тесты, изучать теорию и практиковаться.
      </Text>
      {/* Здесь можно добавить список тестов, кнопки "Начать тест", "Результаты", и т.п. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  text: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
});