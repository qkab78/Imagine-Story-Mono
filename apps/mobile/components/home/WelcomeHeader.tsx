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
import useAuthStore from '@/store/auth/authStore';
import { QuotaBadge } from '@/components/molecules/creation/QuotaBadge';
import { useStoryQuota } from '@/hooks/useStoryQuota';
import { useAppTranslation } from '@/hooks/useAppTranslation';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user }) => {
  const { t } = useAppTranslation('stories');
  const firstname = useAuthStore(state => state.getFirstname());
  const initials = useAuthStore(state => state.getInitials());
  const bounceAnimation = useSharedValue(0);
  const { storiesCreatedThisMonth, limit, remaining, isUnlimited } = useStoryQuota();

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
          {t('home.greeting', { name: firstname })}
        </Text>
        <Text style={styles.subtitle}>
          {t('home.greetingSubtitle')}
        </Text>
        <View style={styles.quotaBadgeContainer}>
          <QuotaBadge
            storiesCreatedThisMonth={storiesCreatedThisMonth}
            limit={limit}
            remaining={remaining}
            isUnlimited={isUnlimited}
            variant="compact"
          />
        </View>
      </View>

      <AnimatedLinearGradient
        colors={['#F6C177', '#E8A957']}
        style={[styles.avatar, animatedAvatarStyle]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {
          initials ? <Text style={styles.avatarText}>
            {initials}
          </Text> : <Text style={styles.avatarText}>
            {firstname?.charAt(0).toUpperCase()}
          </Text>
        }
      </AnimatedLinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 24,
  },
  textSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2F6B4F',
    fontFamily: 'Quicksand',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A6B5A',
    fontFamily: 'Nunito',
    lineHeight: 22,
  },
  quotaBadgeContainer: {
    marginTop: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F6C177',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
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