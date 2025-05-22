import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function VideosScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.videos}</Text>
      <Text style={styles.text}>🎥 Здесь будет видео-обучение и полезные уроки.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, color: '#333' },
});