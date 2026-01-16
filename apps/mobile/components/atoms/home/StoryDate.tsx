
import { StyleSheet, Text } from 'react-native';
import { formatRelativeDate } from '@/utils/dateFormatter';

interface StoryDateProps {
  date?: Date | string;
}

export const StoryDate: React.FC<StoryDateProps> = ({ date }) => {
  return <Text style={styles.date}>{formatRelativeDate(date)}</Text>;
};

const styles = StyleSheet.create({
  date: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7FB8A0',
    fontFamily: 'Nunito',
  },
});

export default StoryDate;
