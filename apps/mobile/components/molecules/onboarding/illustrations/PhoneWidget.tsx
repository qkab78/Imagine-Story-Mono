import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SparkleIcon } from '@/components/atoms/onboarding/SparkleIcon';

export const PhoneWidget: React.FC = () => {
  const phoneOpacity = useSharedValue(0);
  const phoneSlide = useSharedValue(20);
  const mediumWidgetScale = useSharedValue(0);
  const smallWidgetScale = useSharedValue(0);

  useEffect(() => {
    // Phone slides in from below with fade
    phoneOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    phoneSlide.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    // Medium widget pops in after phone appears
    mediumWidgetScale.value = withDelay(
      400,
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    // Small widget pops in slightly after
    smallWidgetScale.value = withDelay(
      600,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, []);

  const phoneStyle = useAnimatedStyle(() => ({
    opacity: phoneOpacity.value,
    transform: [{ translateY: phoneSlide.value }],
  }));

  const mediumWidgetStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mediumWidgetScale.value }],
  }));

  const smallWidgetStyle = useAnimatedStyle(() => ({
    transform: [{ scale: smallWidgetScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Phone body */}
      <Animated.View style={[styles.phone, phoneStyle]}>
        {/* Notch */}
        <View style={styles.statusBar}>
          <View style={styles.notch} />
        </View>

        {/* Story of the Day Widget (medium) - mimics the real widget */}
        <Animated.View style={[styles.storyWidget, mediumWidgetStyle]}>
          {/* Background emoji (faded) */}
          <Text style={styles.bgEmoji}>✨</Text>

          {/* Badge row */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>📖</Text>
              <Text style={styles.badgeText}>HISTOIRE DU JOUR</Text>
            </View>
            <Text style={styles.themeEmoji}>🏰</Text>
          </View>

          {/* Theme tag */}
          <View style={styles.themeTag}>
            <Text style={styles.themeTagText}>MAGIE</Text>
          </View>

          {/* Title */}
          <Text style={styles.storyTitle} numberOfLines={1}>
            Le château enchanté
          </Text>

          {/* Synopsis */}
          <Text style={styles.storySynopsis} numberOfLines={1}>
            Une aventure magique...
          </Text>

          {/* Bottom row */}
          <View style={styles.bottomRow}>
            <Text style={styles.tapHint}>Tap pour lire →</Text>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </Animated.View>

        {/* Quick Create Widget (small) - mimics the real widget */}
        <Animated.View style={[styles.quickCreateWidget, smallWidgetStyle]}>
          {/* Glow effect */}
          <View style={styles.glow} />

          {/* Plus button */}
          <View style={styles.plusButton}>
            <Text style={styles.plusIcon}>+</Text>
          </View>

          {/* Labels */}
          <Text style={styles.createLabel}>Nouvelle</Text>
          <Text style={styles.createLabelFaded}>Histoire</Text>
        </Animated.View>
      </Animated.View>

      {/* Sparkles around the phone */}
      <View style={[styles.sparkle, styles.sparkle1]}>
        <SparkleIcon type="sparkle" size={32} />
      </View>
      <View style={[styles.sparkle, styles.sparkle2]}>
        <SparkleIcon type="star" size={28} delay={1000} />
      </View>
      <View style={[styles.sparkle, styles.sparkle3]}>
        <SparkleIcon type="stars" size={30} delay={2000} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: 140,
    height: 220,
    borderRadius: 20,
    backgroundColor: '#1F3D2B',
    padding: 8,
    shadowColor: '#1F3D2B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 12,
    overflow: 'hidden',
  },
  statusBar: {
    alignItems: 'center',
    marginBottom: 6,
    paddingTop: 4,
  },
  notch: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // --- Story of the Day Widget (medium) ---
  storyWidget: {
    borderRadius: 14,
    padding: 8,
    marginBottom: 6,
    overflow: 'hidden',
    // Gradient approximation: dark purple-blue like "magic" theme
    backgroundColor: '#2a1a3a',
  },
  bgEmoji: {
    position: 'absolute',
    right: 4,
    top: 20,
    fontSize: 16,
    opacity: 0.08,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeIcon: {
    fontSize: 7,
  },
  badgeText: {
    fontSize: 5,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 2,
    letterSpacing: 0.2,
  },
  themeEmoji: {
    fontSize: 14,
  },
  themeTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(232,168,56,0.25)',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(232,168,56,0.4)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginBottom: 3,
  },
  themeTagText: {
    fontSize: 5,
    fontWeight: '600',
    color: '#E8D5A0',
    letterSpacing: 0.3,
  },
  storyTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 1,
  },
  storySynopsis: {
    fontSize: 6,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tapHint: {
    fontSize: 5,
    color: 'rgba(255,255,255,0.45)',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    width: 7,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  // --- Quick Create Widget (small) ---
  quickCreateWidget: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // Green gradient approximation
    backgroundColor: '#2E7D4F',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(232,168,56,0.15)',
    top: 4,
  },
  plusButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    // Gold button
    backgroundColor: '#E8A838',
    shadowColor: '#E8A838',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  plusIcon: {
    fontSize: 14,
    fontWeight: '300',
    color: '#FFFFFF',
    marginTop: -1,
  },
  createLabel: {
    fontSize: 6,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 3,
  },
  createLabelFaded: {
    fontSize: 6,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },

  // --- Sparkles ---
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: -20,
    right: 20,
  },
  sparkle2: {
    bottom: 10,
    left: -10,
  },
  sparkle3: {
    top: '50%',
    right: -20,
  },
});

export default PhoneWidget;
