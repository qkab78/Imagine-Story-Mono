import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

export const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>Mot de passe oublié ? 🤔</Text>
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
