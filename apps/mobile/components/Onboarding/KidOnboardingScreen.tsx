import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, SafeAreaView, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { KidSlide } from './kidSlides';
import KidAnimatedLogo from './KidAnimatedLogo';
import KidProgressDots from './KidProgressDots';
import KidFeatureCard from './KidFeatureCard';
import KidSecurityCard from './KidSecurityCard';
import KidButton from './KidButton';
import AgeBadge from './AgeBadge';
import SafetyBanner from './SafetyBanner';
import { theme } from '@/config/theme';

const { width } = Dimensions.get('window');

interface KidOnboardingScreenProps {
  slide: KidSlide;
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onSkip: () => void;
  onDotPress?: (index: number) => void;
}

const KidOnboardingScreen: React.FC<KidOnboardingScreenProps> = ({
  slide,
  currentSlide,
  totalSlides,
  onNext,
  onSkip,
  onDotPress,
}) => {
  // Animations d'entrée pour les éléments
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  const isCurrentSlide = currentSlide === slide.id - 1;

  useEffect(() => {
    if (isCurrentSlide) {
      // Animation d'entrée quand l'écran devient actif
      contentOpacity.value = withSpring(1, { damping: 20, stiffness: 100 });
      contentTranslateY.value = withSpring(0, { damping: 20, stiffness: 100 });
    } else {
      // Reset pour les écrans non actifs
      contentOpacity.value = withSpring(0.7, { damping: 20, stiffness: 100 });
      contentTranslateY.value = withSpring(10, { damping: 20, stiffness: 100 });
    }
  }, [isCurrentSlide]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const getLogoBackgroundColor = () => {
    switch (slide.id) {
      case 1:
        return theme.colors.secondaryOrange;
      case 2:
        return theme.colors.safetyGreen;
      case 3:
        return theme.colors.kidBlue;
      default:
        return theme.colors.secondaryOrange;
    }
  };

  return (
    <Box style={[styles.container]}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        {/* Age Badge */}
        <AgeBadge />

        {/* Skip Button */}
        <Box style={styles.skipContainer}>
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Ignorer</Text>
          </Pressable>
        </Box>
      </Box>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[contentAnimatedStyle, styles.animatedContent]}>
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingHorizontal="l"
            paddingTop="xl"
          >
            {/* Animated Logo */}
            <Box marginBottom="l">
              <KidAnimatedLogo
                emoji={slide.emoji}
                backgroundColor={getLogoBackgroundColor()}
              />
            </Box>

            <Box alignItems="center" gap="s" width={width * 0.8}>
              {/* Title */}
              <Text style={styles.title}>{slide.title}</Text>

              {/* Subtitle */}
              <Text style={styles.subtitle}>{slide.subtitle}</Text>

              {/* Safety Banner (only on first slide) */}
              {slide.id === 1 && <SafetyBanner />}

              {/* Feature Cards (only on second slide) */}
              {slide.features && (
                <Box width="100%" maxWidth={300} marginBottom="xl">
                  {slide.features.map((feature, index) => (
                    <KidFeatureCard
                      key={index}
                      feature={feature}
                      index={index}
                    />
                  ))}
                </Box>
              )}

              {/* Security Cards (only on third slide) */}
              {slide.securityItems && (
                <Box width="100%" maxWidth={300} marginBottom="xl">
                  {slide.securityItems.map((item, index) => (
                    <KidSecurityCard
                      key={index}
                      item={item}
                      index={index}
                    />
                  ))}
                </Box>
              )}
            </Box>

            <Box g={"l"} alignItems="center">
              {/* Action Button */}
              <KidButton
                title={slide.buttonText}
                emoji={slide.buttonEmoji}
                onPress={onNext}
              />

              {/* Progress Dots */}
              <KidProgressDots
                totalSlides={totalSlides}
                currentSlide={currentSlide}
                onDotPress={onDotPress}
              />
            </Box>
          </Box>
        </Animated.View>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    position: 'relative',
  },
  animatedContent: {
    flex: 1,
    minHeight: '100%',
  },
  skipContainer: {
    position: 'absolute',
    top: 44,
    right: 24,
    zIndex: 10,
  },
  skipButton: {
    padding: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 17,
    fontWeight: '500',
    color: theme.colors.primaryPink,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textGreen,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
    lineHeight: 32,
    maxWidth: 280,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textGray,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    maxWidth: 280,
    fontWeight: '400',
  },
});

export default KidOnboardingScreen;