import { useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  READER_COLORS,
  READER_DIMENSIONS,
  CHAPTER_PLACEHOLDER_EMOJIS,
} from '@/constants/reader';

interface ChapterImageProps {
  imageUrl?: string;
  chapterIndex?: number;
}

export const ChapterImage: React.FC<ChapterImageProps> = ({
  imageUrl,
  chapterIndex = 0,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const placeholderEmoji =
    CHAPTER_PLACEHOLDER_EMOJIS[chapterIndex % CHAPTER_PLACEHOLDER_EMOJIS.length];

  const showPlaceholder = !imageUrl || hasError;

  return (
    <View style={styles.container}>
      {showPlaceholder ? (
        <LinearGradient
          colors={[
            READER_COLORS.placeholderGradientStart,
            READER_COLORS.placeholderGradientEnd,
          ]}
          style={styles.placeholder}
        >
          <Text style={styles.emoji}>{placeholderEmoji}</Text>
        </LinearGradient>
      ) : (
        <>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={READER_COLORS.primary} />
            </View>
          )}
        </>
      )}
      <LinearGradient
        colors={['transparent', READER_COLORS.background]}
        style={styles.overlay}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: READER_DIMENSIONS.chapterImageHeight,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 80,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 248, 240, 0.7)',
  },
});

export default ChapterImage;
