import { create } from 'zustand';

/**
 * Story Filters State
 */
export interface StoryFilters {
  themes: string[];        // IDs des thèmes sélectionnés
  tones: string[];         // IDs des tons sélectionnés
  completedOnly: boolean;  // Histoires terminées uniquement
}

export const DEFAULT_FILTERS: StoryFilters = {
  themes: [],
  tones: [],
  completedOnly: false,
};

/**
 * Filter Store Type
 */
export type FilterStore = {
  filters: StoryFilters;

  // Actions
  setThemes: (themes: string[]) => void;
  toggleTheme: (themeId: string) => void;
  setTones: (tones: string[]) => void;
  toggleTone: (toneId: string) => void;
  setCompletedOnly: (completedOnly: boolean) => void;
  resetFilters: () => void;

  // Computed
  getActiveFiltersCount: () => number;
  hasActiveFilters: () => boolean;
};

const useFilterStore = create<FilterStore>((set, get) => ({
  filters: DEFAULT_FILTERS,

  setThemes: (themes) =>
    set((state) => ({
      filters: { ...state.filters, themes },
    })),

  toggleTheme: (themeId) =>
    set((state) => {
      const themes = state.filters.themes.includes(themeId)
        ? state.filters.themes.filter((id) => id !== themeId)
        : [...state.filters.themes, themeId];
      return { filters: { ...state.filters, themes } };
    }),

  setTones: (tones) =>
    set((state) => ({
      filters: { ...state.filters, tones },
    })),

  toggleTone: (toneId) =>
    set((state) => {
      const tones = state.filters.tones.includes(toneId)
        ? state.filters.tones.filter((id) => id !== toneId)
        : [...state.filters.tones, toneId];
      return { filters: { ...state.filters, tones } };
    }),

  setCompletedOnly: (completedOnly) =>
    set((state) => ({
      filters: { ...state.filters, completedOnly },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  getActiveFiltersCount: () => {
    const { filters } = get();
    let count = 0;
    count += filters.themes.length;
    count += filters.tones.length;
    if (filters.completedOnly) count += 1;
    return count;
  },

  hasActiveFilters: () => {
    const { filters } = get();
    return (
      filters.themes.length > 0 ||
      filters.tones.length > 0 ||
      filters.completedOnly
    );
  },
}));

export default useFilterStore;
