import React, { useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

// Store and hooks
import useProfileStore, { ProfileSettings, settingsDescription, settingsLabel } from '@/store/profile/profileStore';
import useAuthStore from '@/store/auth/authStore';

// Components
import Toggle from '@/components/ui/Toggle';
import StatCard from '@/components/ui/StatCard';

// Theme
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const { width } = Dimensions.get('window');

interface HeaderProps {
  onBackPress: () => void;
}

interface ProfileCardProps {
  fullname: string;
  avatar: string;
}

interface SettingItemProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}

// Composant Header avec glassmorphism
const Header: React.FC<HeaderProps> = ({ onBackPress }) => {
  const backScale = useSharedValue(1);

  const handleBackPress = useCallback(() => {
    backScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    runOnJS(onBackPress)();
  }, [onBackPress]);

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  return (
    <View style={styles.headerContent}>
      <Animated.View style={backAnimatedStyle}>
        <Pressable style={styles.headerButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

// Composant ProfileCard
const ProfileCard: React.FC<ProfileCardProps> = ({
  fullname,
  avatar,
}) => {
  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
      style={styles.profileCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.profileContent}>
        <LinearGradient
          colors={[colors.primaryPink, colors.secondaryOrange]}
          style={styles.avatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.avatarEmoji}>{avatar}</Text>
        </LinearGradient>

        <View style={styles.profileInfo}>
          <Text style={styles.familyName}>{fullname}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

// Composant SettingItem
const SettingItem: React.FC<SettingItemProps> = ({
  label,
  value,
  onValueChange,
  description,
}) => {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      <Toggle
        value={value}
        onValueChange={onValueChange}
        activeColor="#4CAF50"
        inactiveColor="#E0E0E0"
      />
    </View>
  );
};

// Composant principal ProfileScreen
const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { settings, stats, updateSetting } = useProfileStore();
  const { user } = useAuthStore();

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleStatPress = useCallback((statType: string) => {
    console.log(`Stat pressed: ${statType}`);
    // Navigation vers détails des statistiques
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F8FF', '#E8F5E8']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Header onBackPress={handleBackPress} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <ProfileCard
            fullname={user?.fullname ?? ''}
            avatar={'👨‍👩‍👧'}
          />
          {/* Statistics Cards - Row 1 */}
          <View style={styles.statsRow}>
            <StatCard
              value={stats.storiesCreated}
              label="Histoires créées"
              icon="✨"
              accentColor={colors.primaryPink}
              onPress={() => handleStatPress('created')}
            />
            <StatCard
              value={stats.storiesRead}
              label="Histoires lues"
              icon="📖"
              accentColor={colors.accentBlue}
              onPress={() => handleStatPress('read')}
            />
          </View>

          {/* Statistics Cards - Row 2 */}
          <View style={styles.statsRow}>
            <StatCard
              value={stats.favorites}
              label="Favoris"
              icon="❤️"
              accentColor={colors.secondaryOrange}
              onPress={() => handleStatPress('favorites')}
            />
            <StatCard
              value={stats.daysUsed}
              label="Jours d'utilisation"
              icon="📅"
              accentColor={colors.safetyGreen}
              onPress={() => handleStatPress('days')}
            />
          </View>

          {/* Settings Section */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.settingsSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.sectionTitle}>⚙️ Paramètres</Text>

            <View style={styles.settingsContent}>
              {Object.entries(settings).map(([key, value]) => (
                <SettingItem
                  key={key}
                  label={settingsLabel[key as keyof ProfileSettings]}
                  value={value}
                  onValueChange={(value) => updateSetting(key as keyof ProfileSettings, value)}
                  description={settingsDescription[key as keyof ProfileSettings]}
                />
              ))}
            </View>
          </LinearGradient>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: colors.storyCardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  profileCard: {
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: colors.storyCardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primaryPink,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  profileInfo: {
    alignItems: 'center',
  },
  familyName: {
    fontSize: typography.fontSize.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.primary,
    marginBottom: spacing.xs,
  },
  profileDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.primary,
  },
  standaloneSectionTitle: {
    marginHorizontal: 0,
    marginBottom: spacing.lg,
    marginTop: spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  settingsSection: {
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: colors.storyCardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.primary,
    marginBottom: spacing.lg,
  },
  settingsContent: {
    gap: spacing.base,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.base,
  },
  settingLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: "medium",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.primary,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.primary,
  },
});

export default ProfileScreen;