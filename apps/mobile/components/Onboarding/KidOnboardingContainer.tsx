import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { kidSlides } from './kidSlides';
import KidOnboardingScreen from './KidOnboardingScreen';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const getBackgroundColor = (slideId: number) => {
  switch (slideId) {
    case 0: return '#FFE0F0'; // Rose pastel
    case 1: return '#E8F5E8'; // Vert pastel  
    case 2: return '#E3F2FD'; // Bleu pastel
    default: return '#FFE0F0';
  }
};

const KidOnboardingContainer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const translateX = useSharedValue(0);
  
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: getBackgroundColor(currentSlide) }]}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
    flexDirection: 'row',
    width: width * 3, // 3 écrans
  },
});

export default KidOnboardingContainer;