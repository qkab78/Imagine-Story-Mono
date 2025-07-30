import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import Text from '@/components/ui/Text';
import { Tone } from '@/types/creation';
import ToneOption from './ToneOption';
import MagicalButton from '@/components/home/MagicalButton';

interface ToneSelectionCardProps {
  tones: Tone[];
  selectedTone: Tone | null;
  onToneSelect: (tone: Tone) => void;
  onCreateStory: () => void;
}

const ToneSelectionCard: React.FC<ToneSelectionCardProps> = React.memo(({
  tones,
  selectedTone,
  onToneSelect,
  onCreateStory,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Quelle ambiance veux-tu pour ton histoire ? 🌟
      </Text>
      
      <View style={styles.tonesContainer}>
        {tones.map((tone) => (
          <ToneOption
            key={tone.id}
            tone={tone}
            isSelected={selectedTone?.id === tone.id}
            onSelect={onToneSelect}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <MagicalButton
          title="Créer mon histoire magique ! ✨"
          onPress={onCreateStory}
          disabled={!selectedTone}
          style={[
            styles.createButton,
            !selectedTone && styles.createButtonDisabled
          ]}
        />
      </View>
    </View>
  );
});

ToneSelectionCard.displayName = 'ToneSelectionCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: spacing.xl,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  
  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  
  tonesContainer: {
    flex: 1,
    gap: spacing.base,
  },
  
  buttonContainer: {
    marginTop: spacing.xl,
  },
  
  createButton: {
    width: '100%',
  },
  
  createButtonDisabled: {
    opacity: 0.5,
  },
});

export default ToneSelectionCard;