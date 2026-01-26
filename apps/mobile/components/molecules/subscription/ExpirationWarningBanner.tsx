import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ExpirationWarningLevel } from '@/types/subscription';

interface ExpirationWarningBannerProps {
  daysUntilExpiration: number;
  level: ExpirationWarningLevel;
  onRenewPress: () => void;
}

const BANNER_COLORS = {
  info: {
    background: '#FFF9E6',
    border: '#F5C518',
    text: '#7A6200',
    icon: '#F5C518',
  },
  warning: {
    background: '#FFF3E0',
    border: '#FF9800',
    text: '#7A4100',
    icon: '#FF9800',
  },
  urgent: {
    background: '#FFEBEE',
    border: '#F44336',
    text: '#7A1A1A',
    icon: '#F44336',
  },
} as const;

const getMessage = (days: number, level: ExpirationWarningLevel): string => {
  if (level === 'urgent') {
    return days === 1
      ? 'Urgent : votre abonnement expire demain !'
      : `Urgent : votre abonnement expire dans ${days} jours`;
  }
  if (level === 'warning') {
    return `Attention : il vous reste ${days} jours d'abonnement`;
  }
  return `Votre abonnement expire dans ${days} jours`;
};

const getIcon = (level: ExpirationWarningLevel): keyof typeof Ionicons.glyphMap => {
  if (level === 'urgent') return 'warning';
  if (level === 'warning') return 'alert-circle';
  return 'time-outline';
};

export const ExpirationWarningBanner: React.FC<ExpirationWarningBannerProps> = ({
  daysUntilExpiration,
  level,
  onRenewPress,
}) => {
  if (level === 'none') return null;

  const colors = BANNER_COLORS[level];
  const message = getMessage(daysUntilExpiration, level);
  const icon = getIcon(level);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.content}>
        <Ionicons name={icon} size={20} color={colors.icon} style={styles.icon} />
        <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onRenewPress} activeOpacity={0.7}>
        <Text style={styles.buttonText}>Renouveler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ExpirationWarningBanner;
