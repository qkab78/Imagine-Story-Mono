import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AuthButtonProps {
  title: string;
  emoji?: string;
  onPress: () => void;
  variant?: 'primary' | 'signup' | 'google';
  loading?: boolean;
  compact?: boolean;
  disabled?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  emoji,
  onPress,
  variant = 'primary',
  loading = false,
  compact = false,
  disabled = false,
}) => {
  const isGoogleButton = variant === 'google';

  if (isGoogleButton) {
    return (
      <TouchableOpacity
        style={[styles.googleButton, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.googleText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  const gradientColors =
    variant === 'signup'
      ? ['#FF9AA2', '#FFB7B2', '#F6C177']
      : ['#7FB8A0', '#2F6B4F'];

  const buttonStyle = compact ? styles.gradientButtonCompact : styles.gradientButton;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[disabled && styles.buttonDisabled]}
    >
      <LinearGradient
        colors={gradientColors as [ColorValue, ColorValue, ColorValue]}
        style={buttonStyle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={compact ? styles.textCompact : styles.text}>
            {title} {emoji}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 4,
  },
  gradientButtonCompact: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  textCompact: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  googleButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F6C177',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#4285F4',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  googleText: {
    color: '#1F3D2B',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default AuthButton;
