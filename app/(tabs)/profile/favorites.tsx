import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { t } = useTranslation(); 

  const favoritePhrases = favorites.filter((item) => item.type === 'phrase');
  const favoriteProverbs = favorites.filter((item) => item.type === 'proverb');

  const renderPhrase = (item: typeof favorites[0]) => (
    <View key={item.id + item.type} style={styles.phraseCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.phraseText}>{item.phrase}</Text>
        <Pressable onPress={() => toggleFavorite(item)}>
          <FontAwesome name="star" size={24} color="#FFD700" />
        </Pressable>
      </View>
      <Text style={styles.translation}>{item.translation}</Text>
    </View>
  );

  const renderProverb = (item: typeof favorites[0]) => (
    <View key={item.id + item.type} style={styles.proverbCard}>
      <Pressable style={styles.starIcon} onPress={() => toggleFavorite(item)}>
        <Ionicons name="star" size={24} color="#FFD700" />
      </Pressable>
      <Text style={styles.proverbText}>{item.phrase}</Text>
      <Text style={styles.translation}>{item.translation}</Text>
    </View>
  );

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>⭐ {t.favorites}</Text>
  
        {favoritePhrases.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t.phrases}</Text>
            {favoritePhrases.map(renderPhrase)}
          </>
        )}
  
        {favoriteProverbs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t.proverbs}</Text>
            {favoriteProverbs.map(renderProverb)}
          </>
        )}
  
        {favorites.length === 0 && (
          <Text style={styles.emptyText}>{t.favoritesEmpty}</Text>
        )}
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  // 🎨 Стили для фразеологизмов
  phraseCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phraseText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },

  // 🎨 Стили для пословиц
  proverbCard: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
  },
  proverbText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 30,
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },

  translation: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    paddingRight: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});