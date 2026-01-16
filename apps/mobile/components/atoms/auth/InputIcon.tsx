import { StyleSheet, Text } from 'react-native';

interface InputIconProps {
  emoji: string;
  active?: boolean;
  compact?: boolean;
}

export const InputIcon: React.FC<InputIconProps> = ({
  emoji,
  active = false,
  compact = false,
}) => {
  const textStyle = [
    compact ? styles.iconCompact : styles.icon,
    active && styles.iconActive,
  ];

  return <Text style={textStyle}>{emoji}</Text>;
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
    fontSize: 20,
    color: '#8BA598',
  },
  iconCompact: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -9 }],
    fontSize: 18,
    color: '#8BA598',
  },
  iconActive: {
    color: '#2F6B4F',
  },
});

export default InputIcon;
