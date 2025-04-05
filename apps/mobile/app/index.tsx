import { LoginForm } from '@/components/login/LoginForm'
import Slide, { SLIDER_HEIGHT } from '@/components/Onboarding/Slide'
import SubSlide from '@/components/Onboarding/SubSlide'
import Box from '@/components/ui/Box'
import { theme, Theme } from '@/config/theme'
import { useTheme } from '@shopify/restyle'
import { useRef } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, interpolateColor } from 'react-native-reanimated'
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
    subTitle: "Thèmes, héros, langues… Laisse ton imagination choisir et l’app s’occupe du reste. Tu es le maître de l’aventure !",
    right: true,
    color: theme.colors.textTertiary
  },
  {
    label: "Partager",
    subTitle: "Lis ou écoute les histoires avec ton enfant, à l’heure du coucher ou pour un moment doux. Des souvenirs magiques à créer ensemble.",
    right: false,
    color: theme.colors.tomato
  },
]

const { width, height } = Dimensions.get('window');
const FOOTER_TEXT_HEIGHT = height * 0.3;

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
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadii.xl,
  }
})

const Onboarding = () => {
  const scroll = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollX.value,
        slides.map((_, index) => index * width),
        slides.map((slide) => slide.color)
      )
    }
  })

  const footerContentAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: scrollX.value * -1 }],
    }
  })

  const onPress = (index: number) => {
    if (scroll.current) {
      console.log({
        x: width * index,
        y: 0,
        animated: true
      })
      scroll.current.scrollTo({ x: width * (index + 1), y: 0, animated: true });
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
        {/* <Box position={"absolute"} bottom={0} left={0} right={0} top={0} backgroundColor="primaryCardBackground" borderTopLeftRadius={"xl"}></Box> */}
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
            },
            animatedStyles
          ]}
        />
        <Animated.View
          style={[
            styles.footerContent,
            {
              width: width * slides.length,
              flex: 1,
            },
            footerContentAnimatedStyles
          ]}
        >
          {/* Bullet points */}
          {/* <Box flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={"s"}>
              {slides.map((_, index) => (
                <Box key={index} width={20} height={20} backgroundColor="mainBackground" borderRadius={"xl"} />
              ))}
            </Box> */}
          {slides.map((slide, index) => <SubSlide
            key={index}
            subTitle={slide.subTitle}
            scrollX={scrollX}
            isLast={index === slides.length - 1}
            onPress={() => onPress(index)}
          />
          )}
        </Animated.View>
      </Animated.View>
    </Box>
  )
}

export default Onboarding