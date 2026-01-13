import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

export interface ProgressSegmentProps {
  /** État du segment */
  status: 'pending' | 'active' | 'completed';

  /** Largeur flexible du segment */
  flex?: number;
}

/**
 * ProgressSegment - Atom pour la barre de progression
 *
 * Segment individuel de la barre de progression, avec animation
 * de transition entre les états (pending → active → completed).
 *
 * @example
 * ```tsx
 * <View style={{ flexDirection: 'row', gap: 8 }}>
 *   <ProgressSegment status="completed" flex={1} />
 *   <ProgressSegment status="active" flex={1} />
 *   <ProgressSegment status="pending" flex={1} />
 *   <ProgressSegment status="pending" flex={1} />
 * </View>
 * ```
 */
export const ProgressSegment: React.FC<ProgressSegmentProps> = ({
  status,
  flex = 1,
}) => {
  const backgroundColor = useSharedValue(
    getBackgroundColor(status)
  );

  useEffect(() => {
    backgroundColor.value = withTiming(getBackgroundColor(status), {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  return (
    <Animated.View
      style={[
        styles.segment,
        { flex },
        animatedStyle,
      ]}
    />
  );
};

/**
 * Retourne la couleur de fond selon le statut
 */
function getBackgroundColor(status: ProgressSegmentProps['status']): string {
  switch (status) {
    case 'completed':
      return colors.warmAmber; // Amber pour complété
    case 'active':
      return colors.forestGreen; // Vert forêt pour actif
    case 'pending':
    default:
      return 'rgba(127, 184, 160, 0.3)'; // Mint transparent pour en attente
  }
}

const styles = StyleSheet.create({
  segment: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
});

export default ProgressSegment;
