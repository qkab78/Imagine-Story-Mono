import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { kidSlides } from './kidSlides';
import KidOnboardingScreen from './KidOnboardingScreen';
import { OnboardingProgressHeader } from '@/components/molecules/onboarding';
import { router } from 'expo-router';
import { hasCompletedNotificationOnboarding } from '@/store/notifications/notificationStorage';

const { width } = Dimensions.get('window');

const KidOnboardingContainer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const translateX = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const totalSlides = kidSlides.length;

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      translateX.value = withSpring(-width * nextSlide, {
        damping: 25,
        stiffness: 120,
        mass: 0.8,
      });
    } else {
      handleComplete();
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      translateX.value = withSpring(-width * prevSlide, {
        damping: 25,
        stiffness: 120,
        mass: 0.8,
      });
    }
  };

  const goToSlide = (slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < totalSlides && slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
      translateX.value = withSpring(-width * slideIndex, {
        damping: 30,
        stiffness: 150,
        mass: 0.7,
      });
    }
  };

  const handleComplete = () => {
    const notificationOnboardingCompleted = hasCompletedNotificationOnboarding();
    console.log('[Onboarding] handleComplete - notificationOnboardingCompleted:', notificationOnboardingCompleted);

    if (!notificationOnboardingCompleted) {
      console.log('[Onboarding] Navigating to notification-permission');
      router.push('/notification-permission');
    } else {
      console.log('[Onboarding] Navigating to login');
      router.replace('/login');
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <View style={styles.container}>
      {/* Progress Header with gradient background */}
      <LinearGradient
        colors={['#D4A89A', '#C8A4B8', '#9B8AA6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <OnboardingProgressHeader
          currentStep={currentSlide}
          totalSteps={totalSlides}
          onClose={handleSkip}
          showCloseButton={true}
        />
      </LinearGradient>

      {/* Slides content */}
      <View style={styles.slidesContainer}>
        <Animated.View
          style={[
            styles.animatedContainer,
            animatedStyle,
          ]}
        >
          {kidSlides.map((slide, index) => (
            <KidOnboardingScreen
              key={slide.id}
              slide={slide}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onNext={goToNextSlide}
              onBack={goToPreviousSlide}
              onDotPress={goToSlide}
              onComplete={handleComplete}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    width: '100%',
  },
  slidesContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  animatedContainer: {
    flex: 1,
    flexDirection: 'row',
    width: width * 3,
  },
});

export default KidOnboardingContainer;