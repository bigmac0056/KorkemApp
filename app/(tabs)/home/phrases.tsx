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
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useFavoritesStore } from '../../../stores/favoritesStore';
import { FontAwesome } from '@expo/vector-icons';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { AccordionGroup } from '../../../components/AccordionGroup';
import { getPhrases, searchPhrases, initDatabase, Phrase } from '../../../database/database';
import { kazakhAlphabet } from '../../../constants/alphabet';
import { useRouter } from 'expo-router';
import { translations } from '../../../translations';

export default function PhrasesScreen() {
  const { language } = useLanguageContext();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const scrollRef = React.useRef<ScrollView>(null);
  const sectionPositions = React.useRef<Record<string, number>>({});
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const notificationAnim = React.useRef(new Animated.Value(0)).current;
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const router = useRouter();
  const t = useTranslation();

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      await loadPhrases();
    } catch (error) {
      console.error('Error initializing database:', error);
      Alert.alert(t.error, 'Failed to initialize database. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPhrases = useCallback(async () => {
    try {
      const result = await getPhrases();
      setPhrases(result);
    } catch (error) {
      Alert.alert(t.error, 'Failed to load phrases. Please try again.');
    }
  }, [t.error]);

  useEffect(() => {
    initializeDatabase();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchPhrases(searchQuery).then(result => {
        setPhrases(result);
      }).catch(error => {
        Alert.alert(t.error, 'Failed to search phrases. Please try again.');
      });
    } else {
      loadPhrases();
    }
  }, [searchQuery, loadPhrases, t.error]);

  const groupedPhrases = React.useMemo(() => {
    const groups: Record<string, Record<string, Phrase[]>> = {};

    phrases.forEach(item => {
      const phraseUpper = item.phrase.toUpperCase();
      const firstLetter = phraseUpper[0] || '';
      const twoLetters = phraseUpper.slice(0, 2) || firstLetter;

      if (kazakhAlphabet.includes(firstLetter)) {
        if (!groups[firstLetter]) groups[firstLetter] = {};
        if (!groups[firstLetter][twoLetters]) groups[firstLetter][twoLetters] = [];

        groups[firstLetter][twoLetters].push(item);
      }
    });

    return groups;
  }, [phrases]);

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
      fadeAnim.stopAnimation((value) => {
        if (value === 0) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }
      });
    } else if (y <= 300 && showScrollTopButton) {
      fadeAnim.stopAnimation((value) => {
        if (value === 1) {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowScrollTopButton(false);
          });
        }
      });
    }
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const availableLetters = Object.keys(groupedPhrases).sort((a, b) => {
    return kazakhAlphabet.indexOf(a) - kazakhAlphabet.indexOf(b);
  });

  const handleToggleFavorite = (phrase: any) => {
    const isCurrentlyFavorite = isFavorite(String(phrase.id), 'phrase');

    toggleFavorite({
      id: String(phrase.id),
      type: 'phrase',
      phrase: phrase.phrase,
      translation: `${phrase.translation.ru} | ${phrase.translation.kk} | ${phrase.translation.en}`,
    });

    setNotificationMessage(isCurrentlyFavorite ? t.removedFromFavorites : t.addedToFavorites);
    setShowNotification(true);
    
    // Animate in
    Animated.timing(notificationAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Animate out after delay
    setTimeout(() => {
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }).start(() => {
        setShowNotification(false);
      });
    }, 2700);
  };

  const navigateToFavorites = () => {
    router.push('/(tabs)/profile/favorites' as any);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
        <Text style={styles.title}>{t.phrases}</Text>

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

            {Object.entries(groupedPhrases[letter])
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
                    const isFav = isFavorite(String(item.id), 'phrase');
                    return (
                      <View key={item.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.phrase}>{item.phrase}</Text>
                          <Pressable
                            onPress={() => handleToggleFavorite(item)}
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

      {showScrollTopButton && (
        <Animated.View
          style={[
            styles.scrollTopButton,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity onPress={scrollToTop}>
            <FontAwesome name="arrow-up" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {showNotification && (
        <Animated.View 
          style={[
            styles.notification,
            {
              opacity: notificationAnim,
              transform: [{ translateY: notificationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })}],
              backgroundColor: notificationMessage === t.removedFromFavorites ? '#FF4444' : '#4CAF50'
            }
          ]}
        >
          <Text style={styles.notificationText}>{notificationMessage}</Text>
          {notificationMessage === t.addedToFavorites && (
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={navigateToFavorites}
            >
              <Text style={styles.notificationButtonText}>{t.favorites}</Text>
            </TouchableOpacity>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationText: {
    color: 'white',
    flex: 1,
    marginRight: 10,
  },
  notificationButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  notificationButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
});