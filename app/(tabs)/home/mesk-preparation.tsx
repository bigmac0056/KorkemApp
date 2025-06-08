import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MeskPreparationScreen() {
  const t = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.prepareMesk}</Text>
      <Text style={styles.comingSoon}>{t.comingSoon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  comingSoon: {
    fontSize: 18,
    color: '#666',
  },
}); 