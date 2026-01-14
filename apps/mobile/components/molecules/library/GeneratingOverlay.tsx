import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GenerationSpinner, ProgressBar } from '@/components/atoms/library';
import { LIBRARY_COLORS, LIBRARY_DIMENSIONS } from '@/constants/library';

interface GeneratingOverlayProps {
  progress?: number;
}

export const GeneratingOverlay: React.FC<GeneratingOverlayProps> = ({ progress = 0 }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[`${LIBRARY_COLORS.accent}E6`, `${LIBRARY_COLORS.accentWarm}E6`]} // E6 = 90% opacity
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <GenerationSpinner size={32} color="white" borderWidth={3} />
          <Text style={styles.text}>GÉNÉRATION...</Text>
        </View>
      </LinearGradient>

      {/* Progress bar at the bottom */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: LIBRARY_DIMENSIONS.cardBorderRadius,
    borderTopRightRadius: LIBRARY_DIMENSIONS.cardBorderRadius,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default GeneratingOverlay;
