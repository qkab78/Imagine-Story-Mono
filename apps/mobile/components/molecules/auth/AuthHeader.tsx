import { StyleSheet, Text, View } from 'react-native';
import { MagicIcon } from '@/components/atoms/auth';

interface AuthHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
  variant?: 'default' | 'signup';
  compact?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  icon,
  title,
  subtitle,
  variant = 'default',
  compact = false,
}) => {
  return (
    <View style={styles.container}>
      <MagicIcon
        emoji={icon}
        variant={variant}
        size={compact ? 'compact' : 'large'}
      />
      <Text style={compact ? styles.titleCompact : styles.title}>
        {title}
      </Text>
      <Text style={compact ? styles.subtitleCompact : styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: 32,
    fontWeight: '700',
    color: '#2F6B4F',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
  titleCompact: {
    fontFamily: 'Quicksand',
    fontSize: 26,
    fontWeight: '700',
    color: '#2F6B4F',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito',
    color: '#4A6B5A',
    textAlign: 'center',
    lineHeight: 24,
  },
  subtitleCompact: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: '#4A6B5A',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AuthHeader;
