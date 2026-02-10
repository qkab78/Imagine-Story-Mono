import { create } from 'zustand';

export type TabBarDesign = 'glassmorphism' | 'floating';

interface TabBarDesignState {
  design: TabBarDesign;
  setDesign: (design: TabBarDesign) => void;
  toggleDesign: () => void;
}

/**
 * Store to switch between tab bar design variants for testing.
 *
 * - 'glassmorphism': Choice 1 — Glass morphism + floating center button
 * - 'floating': Choice 3 — Floating rounded bar with dot indicator
 */
const useTabBarDesignStore = create<TabBarDesignState>((set, get) => ({
  design: 'glassmorphism',
  setDesign: (design) => set({ design }),
  toggleDesign: () =>
    set({ design: get().design === 'glassmorphism' ? 'floating' : 'glassmorphism' }),
}));

export default useTabBarDesignStore;
