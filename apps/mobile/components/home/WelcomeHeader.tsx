import React, { useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { WelcomeHeaderProps } from '@/types/home';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user }) => {
  const bounceAnimation = useSharedValue(0);

  useEffect(() => {
    bounceAnimation.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnimation.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.textSection}>
        <Text style={styles.greeting}>
          Bonjour {user?.fullname} ! 👋
        </Text>
        <Text style={styles.subtitle}>
          Prête pour une nouvelle aventure ?
        </Text>
      </View>
      
      <AnimatedLinearGradient
        colors={['#FF6B9D', '#FFB74D']}
        style={[styles.avatar, animatedAvatarStyle]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.avatarText}>
          {user?.fullname?.charAt(0).toUpperCase()}
        </Text>
      </AnimatedLinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 32,
  },
  textSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#424242',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    lineHeight: 22,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default WelcomeHeader;