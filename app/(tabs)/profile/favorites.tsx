import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Easing } from 'react-native';
import { useFavoritesStore } from '../../../stores/favoritesStore';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguageContext } from '../../../contexts/LanguageContext';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const t = useTranslation();
  const { language } = useLanguageContext();

  // Разделяем фразеологизмы и пословицы
  const idioms = favorites.filter(item => item.type === 'phrase');
  const proverbs = favorites.filter(item => item.type === 'proverb');

  const handleRemoveFavorite = (item: any) => {
    toggleFavorite(item);
    setNotificationMessage(t.removedFromFavorites);
    setShowNotification(true);
    
    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Animate out after delay
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }).start(() => {
        setShowNotification(false);
      });
    }, 2700);
  };

  const renderSection = (items: typeof favorites, type: 'phrase' | 'proverb') => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {type === 'phrase' ? t.phrases : t.proverbs}
      </Text>
      {items.map((item) => (
        <View 
          key={item.id} 
          style={[
            styles.card,
            { backgroundColor: type === 'phrase' ? '#E3F2FD' : '#FFF3E0' }
          ]}
        >
          <Text style={styles.phrase}>{item.phrase}</Text>
          <Text style={styles.translation}>{item.translation}</Text>
          <Pressable
            style={styles.starIcon}
            onPress={() => handleRemoveFavorite(item)}
          >
            <FontAwesome name="star" size={24} color="#FFD700" />
          </Pressable>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{t.favorites}</Text>

        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>{t.favoritesEmpty}</Text>
        ) : (
          <>
            {renderSection(idioms, 'phrase')}
            {renderSection(proverbs, 'proverb')}
          </>
        )}
      </ScrollView>

      {showNotification && (
        <Animated.View 
          style={[
            styles.notification,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })}],
              backgroundColor: '#FF4444'
            }
          ]}
        >
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
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
  notification: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF4444',
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
  },
});