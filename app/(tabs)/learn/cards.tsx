import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import CARD_DATA from '../../../data/card.json';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguageContext } from '../../../contexts/LanguageContext';

const levels = ['all', 'easy', 'medium', 'hard'];

export default function CardsScreen() {
  const [level, setLevel] = useState('all');
  const [filteredData, setFilteredData] = useState<typeof CARD_DATA>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const t = useTranslation();
  const { language } = useLanguageContext();

  useEffect(() => {
    const filtered = level === 'all'
      ? CARD_DATA
      : CARD_DATA.filter((card) => card.level === level);
    setFilteredData(filtered);
    setCurrentIndex(0);
    setFlipped(false);
    flipAnim.setValue(0);
  }, [level]);

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: flipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => setFlipped(!flipped));
  };

  const nextCard = () => {
    setFlipped(false);
    flipAnim.setValue(0);
    setCurrentIndex((prev) => (prev + 1) % filteredData.length);
  };

  const prevCard = () => {
    setFlipped(false);
    flipAnim.setValue(0);
    setCurrentIndex((prev) =>
      prev === 0 ? filteredData.length - 1 : prev - 1
    );
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    position: 'absolute' as const,
    top: 0,
  };

  const card = filteredData[currentIndex];

  const getTranslation = () => {
    if (!card) return '';
    switch (language) {
      case 'ru':
        return card.translation.ru;
      case 'kz':
        return card.translation.kk;
      case 'en':
        return card.translation.en;
      default:
        return card.translation.ru;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🃏{t.cards}</Text>

      <View style={styles.levelSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelButtonsContainer}>
          {levels.map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[styles.levelButton, level === lvl && styles.levelButtonActive]}
              onPress={() => setLevel(lvl)}
            >
              <Text style={[styles.levelButtonText, level === lvl && styles.levelButtonTextActive]}>
                {lvl.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {card ? (
        <>
          <Text style={styles.counter}>
            {currentIndex + 1} / {filteredData.length}
          </Text>

          <View style={styles.cardContainer}>
            <TouchableOpacity activeOpacity={1} onPress={flipCard}>
              <Animated.View
                style={[styles.card, frontAnimatedStyle, { zIndex: flipped ? 0 : 1 }]}
              >
                <Text style={styles.cardText}>{card.phrase}</Text>
              </Animated.View>
              <Animated.View
                style={[styles.card, styles.cardBack, backAnimatedStyle]}
              >
                <Text style={styles.cardText}>{getTranslation()}</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={prevCard}>
              <Text style={styles.buttonText}>{t.Back}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={nextCard}>
              <Text style={styles.buttonText}>{t.next}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.noCard}>{t.noCards}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  counter: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666' },
  levelSelector: {
    height: 50,
    marginBottom: 16,
  },
  levelButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  levelButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  levelButtonActive: {
    backgroundColor: '#1976D2',
  },
  levelButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  levelButtonTextActive: {
    color: '#fff',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  card: {
    width: 300,
    height: 180,
    backgroundColor: '#1976D2',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardBack: {
    backgroundColor: '#ffcc66',
    position: 'absolute',
    top: 0,
  },
  cardText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noCard: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});