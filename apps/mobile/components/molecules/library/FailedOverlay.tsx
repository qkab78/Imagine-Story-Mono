import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LIBRARY_COLORS, LIBRARY_DIMENSIONS } from '@/constants/library';

interface FailedOverlayProps {
  retryLabel: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const FailedOverlay: React.FC<FailedOverlayProps> = ({ retryLabel, onRetry, isRetrying = false }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[`${LIBRARY_COLORS.error}E6`, '#CC5555E6']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.errorIcon}>!</Text>
          <TouchableOpacity
            style={[styles.retryButton, isRetrying && styles.retryButtonDisabled]}
            onPress={onRetry}
            disabled={isRetrying}
            activeOpacity={0.7}
          >
            <Text style={styles.retryText}>
              {isRetrying ? '...' : retryLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
  errorIcon: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  retryButtonDisabled: {
    opacity: 0.5,
  },
  retryText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default FailedOverlay;
