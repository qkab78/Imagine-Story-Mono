import { Platform } from 'react-native';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

/**
 * Hook pour détecter le support du Liquid Glass et déterminer
 * quelle stratégie de rendu utiliser
 *
 * @returns Object avec les flags de support par plateforme
 */
export const useLiquidGlass = () => {
  // Check si iOS 26+ avec support API runtime
  const isGlassAvailable = Platform.OS === 'ios' && isLiquidGlassAvailable();

  return {
    /** iOS 26+ - Liquid Glass natif disponible */
    hasGlassSupport: isGlassAvailable,

    /** iOS < 26 - Utiliser BlurView comme fallback */
    shouldUseBlur: Platform.OS === 'ios' && !isGlassAvailable,

    /** Android - Utiliser solid background avec shadows */
    shouldUseSolidBackground: Platform.OS !== 'ios',

    /** Plateforme actuelle */
    platform: Platform.OS,
  };
};

export default useLiquidGlass;
