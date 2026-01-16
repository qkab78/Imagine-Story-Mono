import { View, Text, StyleSheet } from 'react-native';
import { SparkleIcon } from '@/components/atoms/onboarding/SparkleIcon';

export const BooksStack: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.booksStack}>
        <View style={[styles.book, styles.book1]}>
          <Text style={styles.bookEmoji}>📗</Text>
        </View>
        <View style={[styles.book, styles.book2]}>
          <Text style={styles.bookEmoji}>📕</Text>
        </View>
        <View style={[styles.book, styles.book3]}>
          <Text style={styles.bookEmoji}>📘</Text>
        </View>
      </View>

      <View style={[styles.sparkle, styles.sparkle1]}>
        <SparkleIcon type="sparkle" size={32} />
      </View>
      <View style={[styles.sparkle, styles.sparkle2]}>
        <SparkleIcon type="star" size={28} delay={1000} />
      </View>
      <View style={[styles.sparkle, styles.sparkle3]}>
        <SparkleIcon type="stars" size={30} delay={2000} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  booksStack: {
    position: 'relative',
    width: 200,
    height: 200,
  },
  book: {
    position: 'absolute',
    width: 140,
    height: 100,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  book1: {
    backgroundColor: '#2F6B4F',
    transform: [{ rotate: '-15deg' }],
    left: 0,
    top: 60,
  },
  book2: {
    backgroundColor: '#FF6B9D',
    transform: [{ rotate: '5deg' }],
    left: 40,
    top: 30,
  },
  book3: {
    backgroundColor: '#F6C177',
    transform: [{ rotate: '-5deg' }],
    left: 80,
    top: 0,
  },
  bookEmoji: {
    fontSize: 40,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: -20,
    right: 20,
  },
  sparkle2: {
    bottom: 10,
    left: -10,
  },
  sparkle3: {
    top: '50%',
    right: -20,
  },
});

export default BooksStack;
