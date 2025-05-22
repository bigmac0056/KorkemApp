// stores/favoritesStore.ts
import { create } from 'zustand';

export type FavoriteItem = {
  id: string;
  phrase: string;
  translation: string;
  type: 'phrase' | 'proverb';
};

export const useFavoritesStore = create<{
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string, type: 'phrase' | 'proverb') => boolean;
}>((set, get) => ({
  favorites: [],

  toggleFavorite: (item) => {
    if (!item.type || (item.type !== 'phrase' && item.type !== 'proverb')) {
      console.warn('❗ Неверный или отсутствующий type у элемента избранного:', item);
      return;
    }

    const { favorites } = get();
    const isFav = favorites.some(
      (fav) => fav.id === item.id && fav.type === item.type
    );

    const updated = isFav
      ? favorites.filter(
          (fav) => !(fav.id === item.id && fav.type === item.type)
        )
      : [...favorites, item];

    set({ favorites: updated });
  },

  isFavorite: (id, type) => {
    const { favorites } = get();
    return favorites.some((fav) => fav.id === id && fav.type === type);
  },
}));