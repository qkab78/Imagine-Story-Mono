import { View, Text, StyleSheet } from 'react-native';
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile';

interface AlertBoxProps {
  title: string;
  text: string;
}

export const AlertBox: React.FC<AlertBoxProps> = ({ title, text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PROFILE_COLORS.alertBackground,
    borderLeftWidth: 4,
    borderLeftColor: PROFILE_COLORS.alertBorder,
    borderRadius: 12,
    padding: PROFILE_SPACING.lg,
    marginBottom: PROFILE_SPACING.xl,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textPrimary,
    marginBottom: PROFILE_SPACING.xs,
  },
  text: {
    fontSize: 13,
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default AlertBox;
