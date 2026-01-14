import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Pressable, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Story } from '@imagine-story/api/app/stories/entities';

const { width } = Dimensions.get('window');

interface StoryPresentationScreenProps {
  story: Story;
}

interface IntegratedHeaderProps {
  onBack: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
}

interface StoryCoverProps {
  coverImage: string;
}

interface StoryInfoProps {
  title: string;
  theme: string;
  tone: string;
  childAge: number;
  numberOfChapters: number;
  synopsis: string;
}

interface StoryTagProps {
  emoji: string;
  text?: string;
}

interface SynopsisCardProps {
  synopsis: string;
}

interface ReadButtonProps {
  onPress: () => void;
}

// Sous-composant Header intégré
const IntegratedHeader: React.FC<IntegratedHeaderProps> = ({
  onBack,
  onFavoritePress,
  isFavorite
}) => {
  const favoriteScale = useSharedValue(1);

  const handleFavoritePress = () => {
    favoriteScale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    runOnJS(onFavoritePress)();
  };

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  return (
    <View style={styles.integratedHeader}>
      <Pressable style={styles.headerButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </Pressable>

      <Animated.View style={favoriteAnimatedStyle}>
        <Pressable style={styles.headerButton} onPress={handleFavoritePress}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? colors.primaryPink : colors.textPrimary}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

// Sous-composant Cover avec animation shimmer
const StoryCover: React.FC<StoryCoverProps> = ({ coverImage }) => {
  return (
    <View style={styles.storyCover}>
      <LinearGradient
        colors={[colors.storyCoverGradientStart, colors.storyCoverGradientEnd]}
        style={StyleSheet.absoluteFillObject}
      />
      <Image source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/images/covers/${coverImage}` }} style={styles.coverImage} />
      {/* <Image source={{ uri: coverImage }} style={styles.coverImage} /> */}
    </View>
  );
};

// Sous-composant Tag
const StoryTag: React.FC<StoryTagProps> = ({ emoji, text }) => (
  <View style={styles.storyTag}>
    <Text style={styles.storyTagText}>{emoji} {text}</Text>
  </View>
);

// Sous-composant Synopsis Card
const SynopsisCard: React.FC<SynopsisCardProps> = ({ synopsis }) => (
  <View style={styles.synopsisCard}>
    <Text style={styles.synopsisTitle}>📖 Synopsis</Text>
    <Text style={styles.synopsisText}>{synopsis}</Text>
  </View>
);

// Mapper les tons aux emojis
const getToneEmoji = (tone: string) => {
  const toneMap: Record<string, string> = {
    'happy': '😊',
    'calm': '🌙',
    'mysterious': '🔍',
    'adventurous': '⚡',
    'funny': '😄',
    'gentle': '💫',
  };
  return toneMap[tone?.toLowerCase()] || '😊';
};

const getThemeEmoji = (theme: string) => {
  const themeMap: Record<string, string> = {
    'fantasy': '🏰',
    'adventure': '🌊',
    'forest': '🌲',
    'space': '🚀',
    'dinosaurs': '🦕',
    'school': '🏫',
  };
  return themeMap[theme?.toLowerCase()] || '📚';
};

// Sous-composant Info d'histoire
const StoryInfo: React.FC<StoryInfoProps> = (props) => {
  const { title, theme, tone, childAge, numberOfChapters, synopsis } = props;
  const estimatedReadTime = numberOfChapters * 1; // 1 minute par chapitre

  return (
    <View style={styles.storyInfo}>
      <Text style={styles.storyTitle}>{title}</Text>

      <View style={styles.storyMeta}>
        <StoryTag emoji={getThemeEmoji(theme)} text={theme} />
        <StoryTag emoji={getToneEmoji(tone)} />
        <StoryTag emoji="👶" text={`${childAge} ans`} />
        <StoryTag emoji="📖" text={`${numberOfChapters} chapitres`} />
        <StoryTag emoji="⏱️" text={`${estimatedReadTime}min`} />
      </View>

      <SynopsisCard synopsis={synopsis} />
    </View>
  );
};

// Sous-composant Bouton de lecture
const ReadButton: React.FC<ReadButtonProps> = ({ onPress }) => {
  const buttonScale = useSharedValue(1);

  const handleButtonPress = () => {
    buttonScale.value = withSequence(
      withTiming(0.98, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    runOnJS(onPress)();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <Animated.View style={buttonAnimatedStyle}>
      <LinearGradient
        colors={[colors.primaryPink, colors.secondaryOrange]}
        style={styles.readButton}
      >
        <Pressable onPress={handleButtonPress} style={styles.readButtonInner}>
          <Text style={styles.readButtonText}>Lire l'histoire à mon enfant 📚</Text>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
};

// Composant principal
const StoryPresentationScreen: React.FC<StoryPresentationScreenProps> = ({ story }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite logic with API
  };

  const handleReadStory = () => {
    router.push(`/stories/${story.id}/reader`);
  };

  return (
    <LinearGradient
      colors={[colors.backgroundStory, colors.backgroundStoryEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView>
          <IntegratedHeader
            onBack={handleBack}
            onFavoritePress={handleToggleFavorite}
            isFavorite={isFavorite}
          />

          <View style={styles.storyContent}>
            <StoryCover coverImage={story.coverImage} />

            <StoryInfo
              title={story.title}
              theme={story.theme.name}
              tone={story.tone.name}
              childAge={story.childAge}
              numberOfChapters={story.numberOfChapters}
              synopsis={story.synopsis}
            />

            <ReadButton onPress={handleReadStory} />
          </View>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    flex: 1,
  },

  integratedHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.cardBackground,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    letterSpacing: -0.2,
    fontFamily: typography.fontFamily.primary,
  },

  storyContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flex: 1,
    gap: spacing.lg,
  },

  storyCover: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.storyCoverGradientStart,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    overflow: 'hidden',
  },

  coverEmoji: {
    fontSize: 64,
  },

  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    width: 100,
  },

  storyInfo: {
    flex: 1,
    gap: spacing.lg,
  },

  storyTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: "bold",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 28.8,
    fontFamily: typography.fontFamily.primary,
  },

  storyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  storyTag: {
    backgroundColor: colors.storyTagBackground,
    borderWidth: 1,
    borderColor: colors.storyTagBorder,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  storyTagText: {
    color: colors.primaryPink,
    fontSize: 12,
    fontWeight: "semibold",
    fontFamily: typography.fontFamily.primary,
  },

  synopsisCard: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.lg,

    flex: 1,
  },

  synopsisTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
    fontFamily: typography.fontFamily.primary,
  },

  synopsisText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22.5,
    fontFamily: typography.fontFamily.primary,
  },

  readButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },

  readButtonInner: {
    alignItems: 'center',
  },

  readButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: typography.fontFamily.primary,
  },

  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default StoryPresentationScreen;