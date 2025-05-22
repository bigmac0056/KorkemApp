import { View, Text, StyleSheet } from 'react-native';

export default function RevisionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Повтор перед МЭСКом</Text>
      <Text style={styles.text}>
        Здесь будут собраны все важные темы и задания для быстрого повтора перед экзаменом.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});