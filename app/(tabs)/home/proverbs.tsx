import React, { useState, useEffect, useCallback } from 'react';
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
import { useFavoritesStore } from '../../../stores/favoritesStore';
import { FontAwesome } from '@expo/vector-icons';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { AccordionGroup } from '../../../components/AccordionGroup';
import { getAllProverbs, searchProverbs, initProverbsDatabase, Proverb } from '../../../database/proverbsDatabase';

export default function ProverbsScreen() {
  const { language } = useLanguageContext();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [proverbs, setProverbs] = useState<Proverb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const scrollRef = React.useRef<ScrollView>(null);
  const sectionPositions = React.useRef<Record<string, number>>({});
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const t = useTranslation();

  // Казахский алфавит для сортировки
  const kazakhAlphabet = [
    'А', 'Ә', 'Б', 'В', 'Г', 'Ғ', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Қ',
    'Л', 'М', 'Н', 'Ң', 'О', 'Ө', 'П', 'Р', 'С', 'Т', 'У', 'Ұ', 'Ү', 'Ф', 'Х',
    'Һ', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'І', 'Ь', 'Э', 'Ю', 'Я'
  ];

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      await new Promise<void>((resolve, reject) => {
        initProverbsDatabase((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      await loadProverbs();
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProverbs = useCallback(() => {
    getAllProverbs((error, result) => {
      if (error) {
        console.error('Error loading proverbs:', error);
        return;
      }
      setProverbs(result);
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchProverbs(searchQuery, (error, result) => {
        if (error) {
          console.error('Error searching proverbs:', error);
          return;
        }
        setProverbs(result);
      });
    } else {
      loadProverbs();
    }
  }, [searchQuery, loadProverbs]);

  const groupedProverbs = React.useMemo(() => {
    const groups: Record<string, Record<string, Proverb[]>> = {};

    proverbs.forEach(item => {
      const proverbUpper = item.proverb.toUpperCase();
      const firstLetter = proverbUpper[0] || '';
      const twoLetters = proverbUpper.slice(0, 2) || firstLetter;

      if (kazakhAlphabet.includes(firstLetter)) {
        if (!groups[firstLetter]) groups[firstLetter] = {};
        if (!groups[firstLetter][twoLetters]) groups[firstLetter][twoLetters] = [];

        groups[firstLetter][twoLetters].push(item);
      }
    });

    return groups;
  }, [proverbs]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const newOpenGroups: Record<string, boolean> = {};
      Object.entries(groupedProverbs).forEach(([_, subgroups]) => {
        Object.entries(subgroups).forEach(([twoLetters, items]) => {
          const hasMatch = items.some(item =>
            item.proverb.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
  }, [searchQuery, groupedProverbs]);

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

  const availableLetters = Object.keys(groupedProverbs).sort((a, b) => {
    return kazakhAlphabet.indexOf(a) - kazakhAlphabet.indexOf(b);
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading proverbs...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.title}>{t.proverbs}</Text>

        <TextInput
          style={styles.searchInput}
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
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

            {Object.entries(groupedProverbs[letter])
              .sort(([a], [b]) => {
                const aIndex = kazakhAlphabet.indexOf(a[0]) * 100 + (kazakhAlphabet.indexOf(a[1]) || 0);
                const bIndex = kazakhAlphabet.indexOf(b[0]) * 100 + (kazakhAlphabet.indexOf(b[1]) || 0);
                return aIndex - bIndex;
              })
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
                    const isFav = isFavorite(String(item.id), 'proverb');
                    return (
                      <View key={item.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.proverb}>{item.proverb}</Text>
                          <Pressable
                            onPress={() =>
                              toggleFavorite({
                                id: String(item.id),
                                type: 'proverb',
                                phrase: item.proverb,
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
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proverb: {
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
  loadingText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
});