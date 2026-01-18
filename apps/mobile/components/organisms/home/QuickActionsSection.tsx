import { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import ActionCard from '@/components/home/ActionCard';
import { QuotaExceededModal } from '@/components/organisms/creation/QuotaExceededModal';
import { QuotaBadge } from '@/components/molecules/creation/QuotaBadge';
import { useStoryQuota } from '@/hooks/useStoryQuota';

interface QuickActionsSectionProps {
  onCreateStory: () => void;
  onReadStories: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onCreateStory,
  onReadStories,
}) => {
  const router = useRouter();
  const { canCreateStory, storiesCreatedThisMonth, limit, remaining, isUnlimited, resetDate } = useStoryQuota();
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  const handleCreateStory = useCallback(() => {
    if (!canCreateStory) {
      setShowQuotaModal(true);
      return;
    }
    onCreateStory();
  }, [canCreateStory, onCreateStory]);

  const handleUpgrade = useCallback(() => {
    setShowQuotaModal(false);
    router.push('/(tabs)/settings');
  }, [router]);

  const handleCloseModal = useCallback(() => {
    setShowQuotaModal(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.createCardContainer}>
        <ActionCard
          title="Créer une histoire"
          description="Invente une nouvelle aventure magique"
          icon="✨"
          iconGradient={['#F6C177', '#E8A957']}
          onPress={handleCreateStory}
          testID="create-story-card"
        />
        {!isUnlimited && (
          <View style={styles.quotaBadgeOverlay}>
            <QuotaBadge
              storiesCreatedThisMonth={storiesCreatedThisMonth}
              limit={limit}
              remaining={remaining}
              isUnlimited={isUnlimited}
              variant="inline"
            />
          </View>
        )}
      </View>
      <ActionCard
        title="Lire une histoire"
        description="Découvre tes histoires préférées"
        icon="📖"
        iconGradient={['#2F6B4F', '#7FB8A0']}
        onPress={onReadStories}
        testID="read-stories-card"
      />

      <QuotaExceededModal
        visible={showQuotaModal}
        onClose={handleCloseModal}
        onUpgrade={handleUpgrade}
        resetDate={resetDate}
        limit={limit}
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
  createCardContainer: {
    position: 'relative',
  },
  quotaBadgeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

export default QuickActionsSection;
