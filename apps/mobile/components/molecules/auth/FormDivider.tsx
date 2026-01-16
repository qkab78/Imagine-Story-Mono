import { StyleSheet, Text, View } from 'react-native';

interface FormDividerProps {
  text?: string;
}

export const FormDivider: React.FC<FormDividerProps> = ({ text = 'ou' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(127, 184, 160, 0.3)',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: '#8BA598',
  },
});

export default FormDivider;
