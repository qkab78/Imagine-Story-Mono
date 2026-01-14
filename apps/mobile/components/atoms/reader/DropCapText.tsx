import { View, Text, StyleSheet } from 'react-native';
import { READER_COLORS, READER_TYPOGRAPHY, READER_SPACING } from '@/constants/reader';

interface DropCapTextProps {
  children: string;
}

export const DropCapText: React.FC<DropCapTextProps> = ({ children }) => {
  if (!children || children.length === 0) {
    return null;
  }

  const firstLetter = children.charAt(0);
  const restOfText = children.slice(1);

  return (
    <View style={styles.container}>
      <Text style={styles.dropCap}>{firstLetter}</Text>
      <Text style={styles.text}>{restOfText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dropCap: {
    fontSize: READER_TYPOGRAPHY.dropCap.fontSize,
    fontWeight: READER_TYPOGRAPHY.dropCap.fontWeight,
    lineHeight: READER_TYPOGRAPHY.dropCap.lineHeight,
    color: READER_COLORS.primary,
    fontFamily: 'Nunito',
    marginRight: READER_SPACING.sm,
    marginTop: READER_SPACING.xs,
  },
  text: {
    flex: 1,
    fontSize: READER_TYPOGRAPHY.storyText.fontSize,
    lineHeight: READER_TYPOGRAPHY.storyText.lineHeight,
    color: READER_COLORS.textPrimary,
    fontFamily: 'Nunito',
    textAlign: 'justify',
  },
});

export default DropCapText;
