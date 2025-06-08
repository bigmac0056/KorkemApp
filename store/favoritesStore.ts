import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavoriteItem = {
  id: string;
  type: 'phrase' | 'proverb';
  phrase: string;
  translation: string;
};

interface FavoritesState {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string, type: string) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string, type: string) => boolean;
  loadFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  
  addFavorite: (item) => {
    set((state) => {
      const newFavorites = [...state.favorites, item];
      AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
  
  removeFavorite: (id, type) => {
    set((state) => {
      const newFavorites = state.favorites.filter(
        (item) => !(item.id === id && item.type === type)
      );
      AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
  
  toggleFavorite: (item) => {
    const { isFavorite, addFavorite, removeFavorite } = get();
    if (isFavorite(item.id, item.type)) {
      removeFavorite(item.id, item.type);
    } else {
      addFavorite(item);
    }
  },
  
  isFavorite: (id, type) => {
    return get().favorites.some(
      (item) => item.id === id && item.type === type
    );
  },
  
  loadFavorites: async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        set({ favorites: JSON.parse(storedFavorites) });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  },
})); 