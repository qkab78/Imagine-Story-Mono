import { create } from 'zustand';

interface SearchContextStore {
  /** Pages that support search functionality */
  searchablePages: string[];

  /** Current active page */
  currentPage: string | null;

  /** Set the current page */
  setCurrentPage: (page: string) => void;

  /** Check if current page is searchable */
  isPageSearchable: () => boolean;

  /** Register a new searchable page dynamically */
  registerSearchablePage: (page: string) => void;
}

/**
 * useSearchContext - Global state for searchable pages
 *
 * Tracks which pages support search functionality and the current page.
 * Used to conditionally show search UI elements.
 */
export const useSearchContext = create<SearchContextStore>((set, get) => ({
  searchablePages: [
    'index',           // Home page (quick search)
    'stories/index',   // Stories list
    'search/index',    // Search page (already has search UI)
  ],

  currentPage: null,

  setCurrentPage: (page: string) => set({ currentPage: page }),

  isPageSearchable: () => {
    const { currentPage, searchablePages } = get();
    return currentPage ? searchablePages.includes(currentPage) : false;
  },

  registerSearchablePage: (page: string) =>
    set((state) => ({
      searchablePages: [...new Set([...state.searchablePages, page])],
    })),
}));

export default useSearchContext;
