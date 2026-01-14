import { Text, StyleSheet } from 'react-native';
import { PROFILE_COLORS, PROFILE_SPACING } from '@/constants/profile';

interface SectionTitleProps {
  children: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: PROFILE_SPACING.md,
    marginLeft: PROFILE_SPACING.xs,
  },
});

export default SectionTitle;
