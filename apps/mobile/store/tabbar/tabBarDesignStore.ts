import { create } from 'zustand';

export type TabBarDesign = 'glassmorphism' | 'floating';

const VALID_DESIGNS: TabBarDesign[] = ['glassmorphism', 'floating'];

function getInitialDesign(): TabBarDesign {
  const envValue = process.env.EXPO_PUBLIC_TAB_BAR_DESIGN;
  if (envValue && VALID_DESIGNS.includes(envValue as TabBarDesign)) {
    return envValue as TabBarDesign;
  }
  return 'glassmorphism';
}

interface TabBarDesignState {
  design: TabBarDesign;
  setDesign: (design: TabBarDesign) => void;
  toggleDesign: () => void;
}

/**
 * Store to switch between tab bar design variants for testing.
 *
 * Initial value is read from EXPO_PUBLIC_TAB_BAR_DESIGN env variable.
 * Valid values: 'glassmorphism' | 'floating'
 * Defaults to 'glassmorphism' if not set or invalid.
 */
const useTabBarDesignStore = create<TabBarDesignState>((set, get) => ({
  design: getInitialDesign(),
  setDesign: (design) => set({ design }),
  toggleDesign: () =>
    set({ design: get().design === 'glassmorphism' ? 'floating' : 'glassmorphism' }),
}));

export default useTabBarDesignStore;
