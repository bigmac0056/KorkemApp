import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';

export default function VideosScreen() {
  const t = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.videos}</Text>
      <Text style={styles.comingSoon}>{t.comingSoon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});