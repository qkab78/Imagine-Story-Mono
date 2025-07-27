import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { kidSlides } from './kidSlides';
import KidOnboardingScreen from './KidOnboardingScreen';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const getGradientLocations = (slideId: number) => {
  switch (slideId) {
    case 0: return [0, 1];
    case 1: return [0, 1];
    case 2: return [0, 1];
  }
};
const getGradientColors = (slideId: number) => {
  switch (slideId) {
    case 0: return ['#FFE0F0', '#FFF3E0']; // Rose pastel gradient
    case 1: return ['#E8F5E8', '#F0FFF0']; // Vert pastel gradient
    case 2: return ['#E3F2FD', '#F0F8FF']; // Bleu pastel gradient
    default: return ['#FFE0F0', '#FFF0F8'];
  }
};


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
      // Last slide - navigate to login
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
    router.replace('/login');
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <LinearGradient
      colors={getGradientColors(currentSlide) as [string, string]}
      locations={getGradientLocations(currentSlide) as [number, number]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Animated.View
        style={[
          styles.animatedContainer,
          animatedStyle,
        ]}
      >
        {kidSlides.map((slide) => (
          <KidOnboardingScreen
            key={slide.id}
            slide={slide}
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onNext={goToNextSlide}
            onSkip={handleSkip}
            onDotPress={goToSlide}
          />
        ))}
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
    flexDirection: 'row',
    width: width * 3, // 3 écrans
  },
});

export default KidOnboardingContainer;