import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../mmkv';

/**
 * Explore State
 */
export interface ExploreState {
  // Search
  searchQuery: string;
  searchHistory: string[];
  isSearchFocused: boolean;

  // Filters
  activeCategory: string;
  selectedAgeGroup: string | null;

  // UI State
  isSearching: boolean;
}

/**
 * Explore Actions
 */
export interface ExploreActions {
  // Search actions
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
  addToSearchHistory: (query: string) => void;
  removeFromSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setIsSearchFocused: (focused: boolean) => void;
  setIsSearching: (searching: boolean) => void;

  // Filter actions
  setActiveCategory: (categoryId: string) => void;
  setSelectedAgeGroup: (ageGroupId: string | null) => void;
  resetFilters: () => void;
}

export type ExploreStore = ExploreState & ExploreActions;

const DEFAULT_STATE: ExploreState = {
  searchQuery: '',
  searchHistory: [],
  isSearchFocused: false,
  activeCategory: 'all',
  selectedAgeGroup: null,
  isSearching: false,
};

const MAX_SEARCH_HISTORY = 10;

const useExploreStore = create<ExploreStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      clearSearchQuery: () => set({ searchQuery: '', isSearching: false, isSearchFocused: false }),

      addToSearchHistory: (query) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery || trimmedQuery.length < 2) return;

        set((state) => {
          const filtered = state.searchHistory.filter(
            (q) => q.toLowerCase() !== trimmedQuery.toLowerCase()
          );
          return {
            searchHistory: [trimmedQuery, ...filtered].slice(0, MAX_SEARCH_HISTORY),
          };
        });
      },

      removeFromSearchHistory: (query) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((q) => q !== query),
        })),

      clearSearchHistory: () => set({ searchHistory: [] }),

      setIsSearchFocused: (focused) => set({ isSearchFocused: focused }),

      setIsSearching: (searching) => set({ isSearching: searching }),

      // Filter actions
      setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),

      setSelectedAgeGroup: (ageGroupId) => set({ selectedAgeGroup: ageGroupId }),

      resetFilters: () =>
        set({
          activeCategory: 'all',
          selectedAgeGroup: null,
        }),
    }),
    {
      name: 'explore-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = storage.getString(name);
          return value ?? null;
        },
        setItem: (name, value) => {
          storage.set(name, value);
        },
        removeItem: (name) => {
          storage.delete(name);
        },
      })),
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        // Don't persist searchQuery, isSearchFocused, isSearching
      }),
    }
  )
);

export default useExploreStore;
