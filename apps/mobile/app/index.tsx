import { authenticate } from '@/api/auth'
import Dot from '@/components/Onboarding/Dot'
import Slide, { SLIDER_HEIGHT } from '@/components/Onboarding/Slide'
import { slides } from '@/components/Onboarding/slides'
import SubSlide from '@/components/Onboarding/SubSlide'
import Box from '@/components/ui/Box'
import { Theme, theme } from '@/config/theme'
import useAuthStore from '@/store/auth/authStore'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, interpolateColor, } from 'react-native-reanimated'
import { View } from 'tamagui'
import { useMMKVString } from 'react-native-mmkv'
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
  const { setToken, setUser } = useAuthStore((state) => state);
  const [userToken] = useMMKVString('user.token');
  const { data, isLoading } = useQuery({
    queryKey: ['authenticate', userToken],
    queryFn: ({ queryKey }) => authenticate(queryKey[1]!),
    enabled: userToken !== undefined,

  })
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
        slides.map((_, index) => theme.colors[slides[index].color]),
      )
    }
  })

  const footerContentAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: scrollX.get() * -1 }],
    }
  })

  const onPress = (index: number, isLast: boolean) => {
    if (scroll.current) {
      scroll.current.scrollTo({ x: width * (index + 1), animated: true });
    }
    if (isLast) {
      router.replace("/login");
    }
  }

  useEffect(() => {
    if (data?.user) {
      setToken(`Bearer ${data.user.currentAccessToken.token}`);
      setUser({
        id: String(data.user.id),
        email: data.user.email,
        fullname: data.user.firstname + " " + data.user.lastname,
        role: Number(data.user.role),
        avatar: '',
      });
      // router.push("/(tabs)");
    }
  }, [data?.user])

  console.log({ data, userToken });


  if (isLoading) {
    return <Box flex={1} justifyContent="center" alignItems="center">
      <ActivityIndicator size={'large'} />
    </Box>
  }

  return (
    <Box flex={1} backgroundColor={"primaryCardBackground"}>
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
              slideColor={slide.color as keyof Theme["colors"]}
              subTitle={slide.subTitle}
              isLast={index === slides.length - 1}
              onPress={() => onPress(index, index === slides.length - 1)}
            />
            )}
          </Animated.View>

        </Animated.View>
      </Animated.View>
    </Box>
  )
}

export default Onboarding