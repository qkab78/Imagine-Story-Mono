import { LoginForm } from '@/components/login/LoginForm'
import Dot from '@/components/Onboarding/Dot'
import Slide, { SLIDER_HEIGHT } from '@/components/Onboarding/Slide'
import SubSlide from '@/components/Onboarding/SubSlide'
import Box from '@/components/ui/Box'
import { theme } from '@/config/theme'
import { useRef } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, interpolateColor, } from 'react-native-reanimated'
import { View } from 'tamagui'

type Slide = {
  label: string;
  subTitle: string;
  right: boolean;
  color: string;
}
const slides: Slide[] = [
  {
    label: "Imaginer",
    subTitle: "Crée des histoires magiques et personnalisées pour ton enfant, avec son prénom, son âge, ses envies… Chaque aventure est unique.",
    right: false,
    color: theme.colors.mainBackground
  },
  {
    label: "Choisir",
    subTitle: "Thèmes, héros, langues… Laisse ton imagination choisir et l'app s'occupe du reste. Tu es le maître de l'aventure !",
    right: true,
    color: theme.colors.textTertiary
  },
  {
    label: "Partager",
    subTitle: "Lis ou écoute les histoires avec ton enfant, à l'heure du coucher ou pour un moment doux. Des souvenirs magiques à créer ensemble.",
    right: false,
    color: theme.colors.tomato
  },
]

const { width } = Dimensions.get('window');


const styles = StyleSheet.create({
  slider: {
    height: SLIDER_HEIGHT,
    borderBottomRightRadius: theme.borderRadii.xl,
  },
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    borderTopLeftRadius: theme.borderRadii.xl,
  },
  footerContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadii.xl,
    flex: 1,
  },
  footerContentElements: {
    flex: 1,
    width: width * slides.length,
    flexDirection: "row",
  },
  pagination: {
    ...StyleSheet.absoluteFillObject,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  }
})

const Onboarding = () => {
  const scroll = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.set(() => event.contentOffset.x)
  })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollX.get(),
        slides.map((_, index) => index * width),
        slides.map((slide) => slide.color)
      )
    }
  })

  const footerContentAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: scrollX.get() * -1 }],
    }
  })

  const onPress = (index: number) => {
    if (scroll.current) {
      scroll.current.scrollTo({ x: width * (index + 1), animated: true });
    }
  }

  return (
    <Box flex={1} backgroundColor={"primaryCardBackground"}>
      {/* <Text variant="title">Imagine Story</Text>
      <LoginForm /> */}
      {/* Slider */}
      <Animated.View
        style={[
          styles.slider,
          animatedStyles
        ]}
      >
        <Animated.ScrollView
          ref={scroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          snapToAlignment="center"
          decelerationRate="fast"
          bounces={false}
          onScroll={scrollHandler}
          scrollEventThrottle={1}
        >
          {slides.map((slide, index) => (
            <Slide key={index} label={slide.label} right={slide.right} />
          ))}
        </Animated.ScrollView>
      </Animated.View>
      {/* Footer */}
      <Animated.View
        style={[
          {
            flex: 1,
          },
          animatedStyles
        ]}
      >
        <Animated.View style={[{ ...StyleSheet.absoluteFillObject }, animatedStyles]} />
        <Animated.View style={styles.footerContent}>
          <View style={styles.pagination}>
            {slides.map((_, index) => <Dot key={index} index={index} currentIndex={scrollX} />)}
          </View>

          <Animated.View style={[styles.footerContentElements, footerContentAnimatedStyles]}>
            {slides.map((slide, index) => <SubSlide
              key={index}
              subTitle={slide.subTitle}
              isLast={index === slides.length - 1}
              onPress={() => onPress(index)}
            />
            )}
          </Animated.View>

        </Animated.View>
      </Animated.View>
    </Box>
  )
}

export default Onboarding