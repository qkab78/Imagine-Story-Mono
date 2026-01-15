import { StyleSheet, Text, View } from 'react-native';

interface SectionTitleProps {
  title: string;
  icon?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, icon }) => {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: 20,
    fontWeight: '700',
    color: '#2F6B4F',
  },
});

export default SectionTitle;
