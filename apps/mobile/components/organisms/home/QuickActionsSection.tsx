import { StyleSheet, View } from 'react-native';
import ActionCard from '@/components/home/ActionCard';

interface QuickActionsSectionProps {
  onCreateStory: () => void;
  onReadStories: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onCreateStory,
  onReadStories,
}) => {
  return (
    <View style={styles.container}>
      <ActionCard
        title="Créer une histoire"
        description="Invente une nouvelle aventure magique"
        icon="✨"
        iconGradient={['#F6C177', '#E8A957']}
        onPress={onCreateStory}
        testID="create-story-card"
      />
      <ActionCard
        title="Lire une histoire"
        description="Découvre tes histoires préférées"
        icon="📖"
        iconGradient={['#2F6B4F', '#7FB8A0']}
        onPress={onReadStories}
        testID="read-stories-card"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
});

export default QuickActionsSection;
