import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeIconProps {
  emoji: string;
  gradient: [string, string];
  size?: number;
}

export const HomeIcon: React.FC<HomeIconProps> = ({
  emoji,
  gradient,
  size = 64
}) => {
  return (
    <LinearGradient
      colors={gradient}
      style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={[styles.emoji, { fontSize: size * 0.4375 }]}>{emoji}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emoji: {
    textAlign: 'center',
  },
});

export default HomeIcon;
