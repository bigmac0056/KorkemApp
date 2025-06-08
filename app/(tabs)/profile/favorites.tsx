import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useFavoritesStore } from '../../../stores/favoritesStore';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguageContext } from '../../../contexts/LanguageContext';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const t = useTranslation();
  const { language } = useLanguageContext();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t.favorites}</Text>

      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>{t.favoritesEmpty}</Text>
      ) : (
        favorites.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.phrase}>{item.phrase}</Text>
            <Text style={styles.translation}>{item.translation}</Text>
            <Pressable
              style={styles.starIcon}
              onPress={() => toggleFavorite(item)}
            >
              <FontAwesome name="star" size={24} color="#FFD700" />
            </Pressable>
          </View>
        ))
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
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phrase: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  translation: {
    fontSize: 16,
    color: '#666',
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});