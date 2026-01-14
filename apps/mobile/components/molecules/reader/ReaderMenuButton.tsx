import { Pressable, View, StyleSheet } from 'react-native';
import { READER_COLORS, READER_DIMENSIONS } from '@/constants/reader';

interface ReaderMenuButtonProps {
  onPress: () => void;
}

export const ReaderMenuButton: React.FC<ReaderMenuButtonProps> = ({
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.dot} />
      <View style={styles.dot} />
      <View style={styles.dot} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: READER_DIMENSIONS.navButtonSize,
    height: READER_DIMENSIONS.navButtonSize,
    borderRadius: 50,
    backgroundColor: READER_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: READER_COLORS.primary,
  },
});

export default ReaderMenuButton;
