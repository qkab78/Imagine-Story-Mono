import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AuthFooterProps {
  question: string;
  linkText: string;
  onLinkPress: () => void;
  compact?: boolean;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  question,
  linkText,
  onLinkPress,
  compact = false,
}) => {
  return (
    <View style={compact ? styles.containerCompact : styles.container}>
      <Text style={compact ? styles.questionCompact : styles.question}>
        {question}
      </Text>
      <TouchableOpacity onPress={onLinkPress} activeOpacity={0.7}>
        <Text style={styles.link}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 24,
  },
  containerCompact: {
    alignItems: 'center',
    marginTop: 16,
  },
  question: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: '#4A6B5A',
    textAlign: 'center',
    marginBottom: 4,
  },
  questionCompact: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: '#4A6B5A',
    textAlign: 'center',
    marginBottom: 4,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: '#2F6B4F',
    textAlign: 'center',
  },
});

export default AuthFooter;
