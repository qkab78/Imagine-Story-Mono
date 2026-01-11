import React from 'react';
import { StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { colors } from '@/theme/colors';

interface StoryThumbnailProps {
  imageUrl: string;
  size?: number;
  borderRadius?: number;
}

export const StoryThumbnail: React.FC<StoryThumbnailProps> = ({ 
  imageUrl, 
  size = 50,
  borderRadius = 25
}) => {
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${process.env.EXPO_PUBLIC_API_URL}/images/covers/${imageUrl}`;

  return (
    <Image 
      source={{ uri: fullImageUrl }} 
      style={[
        styles.thumbnail, 
        { 
          width: size, 
          height: size, 
          borderRadius 
        }
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default StoryThumbnail;
