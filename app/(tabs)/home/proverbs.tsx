import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
  Easing,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFavoritesStore } from '../../../stores/favoritesStore';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { getAllProverbs, searchProverbs, initProverbsDatabase, Proverb } from '../../../database/proverbsDatabase';

export default function ProverbsScreen() {
  const { language } = useLanguageContext();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [proverbs, setProverbs] = useState<Proverb[]>([]);
  const t = useTranslation();
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await new Promise<void>((resolve, reject) => {
        initProverbsDatabase((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      loadProverbs();
    } catch (error) {
      console.error('Error initializing database:', error);
      Alert.alert('Error', 'Failed to initialize database');
    }
  };

  const loadProverbs = () => {
    getAllProverbs((error, result) => {
      if (error) {
        console.error('Error loading proverbs:', error);
        Alert.alert('Error', 'Failed to load proverbs');
      } else {
        setProverbs(result);
      }
    });
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      loadProverbs();
    } else {
      searchProverbs(searchQuery, (error, result) => {
        if (error) {
          console.error('Error searching proverbs:', error);
          Alert.alert('Error', 'Failed to search proverbs');
        } else {
          setProverbs(result);
        }
      });
    }
  }, [searchQuery]);

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
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleMeskPreparation = () => {
    // TODO: Implement MESK preparation functionality
    Alert.alert('Coming Soon', 'MESK preparation feature will be available soon!');
  };

  const handleMeskRevision = () => {
    // TODO: Implement MESK revision functionality
    Alert.alert('Coming Soon', 'MESK revision feature will be available soon!');
  };

  if (proverbs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading proverbs...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
        <Text style={styles.title}>{t.proverbs}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.meskButton} onPress={handleMeskPreparation}>
            <Text style={styles.meskButtonText}>{t.prepareMesk}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.meskButton} onPress={handleMeskRevision}>
            <Text style={styles.meskButtonText}>{t.revisionMesk}</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder={t.searchProverbs}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />

        {proverbs.map((item) => {
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
                  style={styles.favoriteButton}
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
      </ScrollView>

      {Platform.OS === 'android' && showScrollTopButton && (
        <Animated.View style={[styles.scrollTopButton, { opacity: fadeAnim }]}>
          <Pressable onPress={scrollToTop}>
            <FontAwesome name="arrow-up" size={28} color="#fff" />
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff8e1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  meskButton: {
    flex: 1,
    backgroundColor: '#ffd54f',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  meskButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ffd54f',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#ffd54f',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  proverb: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    marginRight: 15,
    color: '#2c3e50',
    lineHeight: 28,
  },
  translation: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  favoriteButton: {
    padding: 8,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#ffd54f',
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