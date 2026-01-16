import { useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { KidSlide } from './kidSlides';
import {
  OnboardingIllustration,
  OnboardingHeader,
  OnboardingNavigation,
} from '@/components/molecules/onboarding';

const { width } = Dimensions.get('window');

interface KidOnboardingScreenProps {
  slide: KidSlide;
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onBack: () => void;
  onDotPress?: (index: number) => void;
  onComplete: () => void;
}

const KidOnboardingScreen: React.FC<KidOnboardingScreenProps> = ({
  slide,
  currentSlide,
  totalSlides,
  onNext,
  onBack,
  onDotPress,
  onComplete,
}) => {
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  const isCurrentSlide = currentSlide === slide.id - 1;
  const isFirstSlide = slide.id === 1;
  const isLastSlide = slide.isLast || slide.id === totalSlides;

  useEffect(() => {
    if (isCurrentSlide) {
      contentOpacity.value = withSpring(1, { damping: 20, stiffness: 100 });
      contentTranslateY.value = withSpring(0, { damping: 20, stiffness: 100 });
    } else {
      contentOpacity.value = withSpring(0.7, { damping: 20, stiffness: 100 });
      contentTranslateY.value = withSpring(10, { damping: 20, stiffness: 100 });
    }
  }, [isCurrentSlide]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handlePrimaryPress = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[contentAnimatedStyle, styles.content]}>
        {/* Hero Section with Illustration */}
        <View style={styles.hero}>
          <OnboardingIllustration type={slide.illustrationType} />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <OnboardingHeader
            title={slide.title}
            description={slide.description}
          />

          <OnboardingNavigation
            currentStep={currentSlide}
            totalSteps={totalSlides}
            onBack={!isFirstSlide ? onBack : undefined}
            onNext={!isLastSlide ? onNext : undefined}
            onPrimary={handlePrimaryPress}
            primaryLabel={slide.buttonLabel}
            showBackButton={!isFirstSlide}
            showNextButton={!isLastSlide}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },
  content: {
    flex: 1,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  contentSection: {
    paddingBottom: 32,
  },
});

export default KidOnboardingScreen;
