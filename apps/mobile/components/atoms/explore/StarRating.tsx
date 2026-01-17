import { View, StyleSheet } from 'react-native';
import { DualIcon } from '@/components/ui/DualIcon';
import { EXPLORE_COLORS, EXPLORE_ICONS } from '@/constants/explore';

interface StarRatingProps {
  rating: number;
  size?: number;
  maxStars?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 12,
  maxStars = 5,
}) => {
  const filledStars = Math.round(rating);

  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }).map((_, index) => (
        <DualIcon
          key={index}
          icon={index < filledStars ? EXPLORE_ICONS.starFill : EXPLORE_ICONS.star}
          size={size}
          color={
            index < filledStars
              ? EXPLORE_COLORS.starFilled
              : EXPLORE_COLORS.starEmpty
          }
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

export default StarRating;
