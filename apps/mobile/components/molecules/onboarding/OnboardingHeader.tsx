import { View, Text, StyleSheet } from 'react-native';

interface OnboardingHeaderProps {
  title: string;
  description: string;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F3D2B',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: '#4A6B5A',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default OnboardingHeader;
