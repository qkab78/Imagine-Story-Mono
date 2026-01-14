import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileContent } from '@/components/organisms/profile';
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[PROFILE_COLORS.backgroundTop, PROFILE_COLORS.backgroundBottom]}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + PROFILE_SPACING.lg }]}>
        <Text style={styles.title}>Profil</Text>
      </View>
      <ProfileContent />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: PROFILE_SPACING.xxl,
    paddingBottom: PROFILE_SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Quicksand',
    color: PROFILE_COLORS.textPrimary,
  },
});

export default ProfileScreen;
