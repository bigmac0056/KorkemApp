import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Platform
} from 'react-native';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useMemo, useRef, useEffect } from 'react';
import phrasesData from '@/data/phrases.json';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { AccordionGroup } from '@/components/AccordionGroup';

type Phrase = {
  id: number;
  phrase: string;
  translation: {
    ru: string;
    kk: string;
    en: string;
  };
};

export default function PhrasesScreen() {
  const { language } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [phrases, setPhrases] = useState<Phrase[]>(phrasesData);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<string, number>>({});
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  const groupedPhrases = useMemo(() => {
    const filtered = phrases.filter(item =>
      item.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.kk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.en.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, Record<string, Phrase[]>> = {};

    filtered.forEach(item => {
      const firstLetter = item.phrase[0].toUpperCase();
      const twoLetters = item.phrase.slice(0, 2).toUpperCase();

      if (!groups[firstLetter]) groups[firstLetter] = {};
      if (!groups[firstLetter][twoLetters]) groups[firstLetter][twoLetters] = [];

      groups[firstLetter][twoLetters].push(item);
    });

    return groups;
  }, [searchQuery, phrases]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const newOpenGroups: Record<string, boolean> = {};
      Object.entries(groupedPhrases).forEach(([_, subgroups]) => {
        Object.entries(subgroups).forEach(([twoLetters, items]) => {
          const hasMatch = items.some(item =>
            item.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.translation.ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.translation.kk.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.translation.en.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (hasMatch) {
            newOpenGroups[twoLetters] = true;
          }
        });
      });
      setOpenGroups(newOpenGroups);
    } else {
      setOpenGroups({});
    }
  }, [searchQuery, groupedPhrases]);

  const scrollToLetter = (letter: string) => {
    const y = sectionPositions.current[letter];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y, animated: true });
    }
  };

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 300 && !showScrollTopButton) {
      setShowScrollTopButton(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else if (y <= 300 && showScrollTopButton) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowScrollTopButton(false);
      });
    }
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const availableLetters = Object.keys(groupedPhrases).sort();

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.title}>{t.phrases}</Text>

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

            {Object.entries(groupedPhrases[letter])
              .sort()
              .map(([twoLetters, items]) => (
                <AccordionGroup
                  key={twoLetters}
                  title={twoLetters}
                  isOpen={!!openGroups[twoLetters]}
                  onToggle={() =>
                    setOpenGroups(prev => ({
                      ...prev,
                      [twoLetters]: !prev[twoLetters],
                    }))
                  }
                >
                  {items.map(item => {
                    const isFav = isFavorite(String(item.id), 'phrase');
                    return (
                      <View key={item.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.phrase}>{item.phrase}</Text>
                          <Pressable
                            onPress={() =>
                              toggleFavorite({
                                id: String(item.id),
                                type: 'phrase',
                                phrase: item.phrase,
                                translation: `${item.translation.ru} | ${item.translation.kk} | ${item.translation.en}`,
                              })
                            }
                          >
                            <FontAwesome
                              name={isFav ? 'star' : 'star-o'}
                              size={24}
                              color={isFav ? '#FFD700' : '#555'}
                            />
                          </Pressable>
                        </View>
                        <Text style={styles.translation}>
                          {language === 'ru' && item.translation.ru}
                          {language === 'kz' && item.translation.kk}
                          {language === 'en' && item.translation.en}
                        </Text>
                      </View>
                    );
                  })}
                </AccordionGroup>
              ))}
          </View>
        ))}

        {availableLetters.length === 0 && (
          <Text style={styles.emptyText}>{t.nothingFound}</Text>
        )}
      </ScrollView>

      {Platform.OS === 'android' && showScrollTopButton && (
        <Animated.View style={[styles.scrollTopButton, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={scrollToTop}>
            <FontAwesome name="arrow-up" size={28} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
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
    marginBottom: 10,
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
  phrase: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  translation: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    lineHeight: 22,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 14,
    elevation: 5,
  },
});