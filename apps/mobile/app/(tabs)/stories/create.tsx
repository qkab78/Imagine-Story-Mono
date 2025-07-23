import { Dimensions, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import { CreatStoryForm } from '@/components/stories/CreateStoryForm';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import { Sparkles, Wand2, BookPlus } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';


const { width, height } = Dimensions.get('window');

const MagicalHeader = () => {
  const floatingAnimation = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  
  React.useEffect(() => {
    floatingAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 4000 }),
      -1,
      false
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatingAnimation.value, [0, 1], [-8, 8]);
    return {
      transform: [{ translateY }],
    };
  });

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  return (
    <Box alignItems="center" paddingVertical="xl" paddingHorizontal="m">
      <Animated.View style={floatingStyle}>
        <Box flexDirection="row" alignItems="center" justifyContent="center" marginBottom="s">
          <Animated.View style={sparkleStyle}>
            <Sparkles size={28} color="#6B46C1" />
          </Animated.View>
          <Wand2 size={32} color="#F59E0B" style={{ marginHorizontal: 12 }} />
          <Animated.View style={[sparkleStyle, { transform: [{ rotate: '180deg' }] }]}>
            <Sparkles size={28} color="#6B46C1" />
          </Animated.View>
        </Box>
      </Animated.View>
      
      <Text style={styles.magicalTitle}>
        ✨ Créons ton Histoire Magique ✨
      </Text>
      
      <Text style={styles.subtitle}>
        Raconte-nous ton rêve et nous le transformerons en aventure!
      </Text>
    </Box>
  );
};

const CreateStory = () => {
  const theme = useTheme<Theme>();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F0E6FF' }]}>
      <Box style={styles.gradient}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MagicalHeader />
          <Box flex={1} paddingHorizontal="m">
            <CreatStoryForm />
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  magicalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B46C1',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B5CF6',
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});

export default CreateStory;