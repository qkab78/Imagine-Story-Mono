import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

export const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({
  onPress,
}) => {
  const { t } = useAppTranslation('auth');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{t('login.forgotPassword')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: '#4A6B5A',
  },
});

export default ForgotPasswordLink;
