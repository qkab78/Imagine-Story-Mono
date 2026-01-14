import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PROFILE_COLORS, PROFILE_DIMENSIONS } from '@/constants/profile';

interface ProfileAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  imageUrl,
  size = PROFILE_DIMENSIONS.avatarSize,
}) => {
  const initials = getInitials(name);
  const fontSize = size * 0.4;

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  return (
    <LinearGradient
      colors={[PROFILE_COLORS.avatarGradientStart, PROFILE_COLORS.avatarGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: 'white',
    fontWeight: '700',
    fontFamily: 'Quicksand',
  },
});

export default ProfileAvatar;
