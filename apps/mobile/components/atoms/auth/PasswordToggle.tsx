import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface PasswordToggleProps {
  visible: boolean;
  onToggle: () => void;
}

export const PasswordToggle: React.FC<PasswordToggleProps> = ({
  visible,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
    >
      <Text style={styles.emoji}>{visible ? '👁️' : '🙈'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 10,
  },
  emoji: {
    fontSize: 20,
    color: '#7FB8A0',
  },
});

export default PasswordToggle;
