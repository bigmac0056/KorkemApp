import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import proverbsData from '@/data/proverbs.json'; 
import { useTranslation } from '@/hooks/useTranslation';

type Proverb = {
  id: number;
  proverb: string;
  translation: {
    ru: string;
    kk: string;
    en: string;
  };
};


export default function ProverbsScreen() {
  const { language } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [proverbs, setProverbs] = useState<Proverb[]>(proverbsData);
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<string, number>>({});
  const { t } = useTranslation();

  const groupedProverbs = useMemo(() => {
    const filtered = proverbs.filter(item =>
      item.proverb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.kk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.en.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const groups: Record<string, Proverb[]> = {};
    filtered.forEach(item => {
      const letter = item.proverb[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(item);
    });
    return groups;
  }, [searchQuery, proverbs]);

  const scrollToLetter = (letter: string) => {
    const y = sectionPositions.current[letter];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y, animated: true });
    }
  };

  const availableLetters = Object.keys(groupedProverbs).sort();

  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollRef}>
      <Text style={styles.title}>{t.proverbs}</Text>

      <TextInput
        style={styles.searchInput}
        placeholder={t.searchPlaceholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.letterNav}>
        {availableLetters.map(letter => (
          <TouchableOpacity key={letter} onPress={() => scrollToLetter(letter)}>
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {availableLetters.map(letter => (
        <View
          key={letter}
          onLayout={event => {
            sectionPositions.current[letter] = event.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.sectionTitle}>{letter}</Text>
          {groupedProverbs[letter].map(item => {
            const isFav = isFavorite(String(item.id), 'proverb');
            return (
              <View key={item.id} style={styles.card}>
                <Pressable
                  style={styles.starIcon}
                  onPress={() =>
                    toggleFavorite({
                      id: String(item.id),
                      type: 'proverb',
                      phrase: item.proverb,
                      translation: `${item.translation.ru} | ${item.translation.kk} | ${item.translation.en}`,
                    })
                  }
                >
                  <Ionicons
                    name={isFav ? 'star' : 'star-outline'}
                    size={24}
                    color={isFav ? '#FFD700' : '#999'}
                  />
                </Pressable>
                <Text style={styles.proverb}>{item.proverb}</Text>
                <Text style={styles.translation}>
                  {language === 'ru' && item.translation.ru}
                  {language === 'kz' && item.translation.kk}
                  {language === 'en' && item.translation.en}
                </Text>
              </View>
            );
          })}
        </View>
      ))}

      {availableLetters.length === 0 && (
        <Text style={styles.emptyText}>{t.nothingFound}</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  letterNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  letter: {
    marginRight: 10,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  proverb: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 30,
  },
  translation: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    paddingRight: 30,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});