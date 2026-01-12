import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Hero } from '@/domain/stories/value-objects/Hero';
import { Theme } from '@/domain/stories/value-objects/settings/Theme';
import { Tone } from '@/domain/stories/value-objects/settings/Tone';
import { HeroSelectionGrid } from './HeroSelectionGrid';
import { ThemeSelectionGrid } from './ThemeSelectionGrid';
import { ToneSelectionList } from './ToneSelectionList';
import type { StoryCreationFormData } from '@/types/creation';
import { HEROES, THEMES, TONES } from '@/types/creation';
import { ALLOWED_LANGUAGES } from '@imagine-story/api/app/stories/constants/allowed_languages';

interface StoryCreationFormProps {
  currentStep: number;
  onStepComplete: (formData: StoryCreationFormData) => void;
  initialData?: Partial<StoryCreationFormData>;
}

export const StoryCreationForm: React.FC<StoryCreationFormProps> = ({
  currentStep,
  onStepComplete,
  initialData,
}) => {
  const { control, handleSubmit, watch, setValue } = useForm<StoryCreationFormData>({
    defaultValues: {
      hero: initialData?.hero || HEROES[0],
      heroName: initialData?.heroName || '',
      language: initialData?.language || ALLOWED_LANGUAGES.FR,
      age: initialData?.age || 5,
      numberOfChapters: initialData?.numberOfChapters || 3,
      theme: initialData?.theme || THEMES[0],
      tone: initialData?.tone || TONES[0],
    }
  });

  const selectedHero = watch('hero');
  const selectedTheme = watch('theme');
  const selectedTone = watch('tone');

  const handleHeroContinue = handleSubmit((data) => {
    onStepComplete(data);
  });

  const handleThemeContinue = handleSubmit((data) => {
    onStepComplete(data);
  });

  const handleToneContinue = handleSubmit((data) => {
    onStepComplete(data);
  });

  // Map frontend types to domain value objects
  const heroes = HEROES.map(h => Hero.create(h.id, h.emoji, h.name));
  const themes = THEMES.map(t => Theme.create(t.id, t.name, t.description));
  const tones = TONES.map(t => Tone.create(t.id, t.title, t.description));

  const themeEmojis: Record<string, string> = {};
  const themeColors: Record<string, string> = {};
  THEMES.forEach(t => {
    themeEmojis[t.id] = t.emoji;
    themeColors[t.id] = t.color;
  });

  const toneEmojis: Record<string, string> = {};
  TONES.forEach(t => {
    toneEmojis[t.id] = t.emoji;
  });

  // Map domain back to frontend for form
  const selectedHeroDomain = selectedHero ? Hero.create(selectedHero.id, selectedHero.emoji, selectedHero.name) : null;
  const selectedThemeDomain = selectedTheme ? Theme.create(selectedTheme.id, selectedTheme.name, selectedTheme.description) : null;
  const selectedToneDomain = selectedTone ? Tone.create(selectedTone.id, selectedTone.title, selectedTone.description) : null;

  return (
    <View style={styles.container}>
      {currentStep === 1 && (
        <HeroSelectionGrid
          heroes={heroes}
          selectedHero={selectedHeroDomain}
          onHeroSelect={(hero) => {
            const heroData = HEROES.find(h => h.id === hero.getValue());
            if (heroData) setValue('hero', heroData);
          }}
          control={control}
          onContinue={handleHeroContinue}
        />
      )}
      
      {currentStep === 2 && (
        <ThemeSelectionGrid
          themes={themes}
          themeEmojis={themeEmojis}
          themeColors={themeColors}
          selectedTheme={selectedThemeDomain}
          onThemeSelect={(theme) => {
            const themeData = THEMES.find(t => t.id === theme.getIdValue());
            if (themeData) setValue('theme', themeData);
          }}
          onCreateStory={handleThemeContinue}
        />
      )}
      
      {currentStep === 3 && (
        <ToneSelectionList
          tones={tones}
          toneEmojis={toneEmojis}
          selectedTone={selectedToneDomain}
          onToneSelect={(tone) => {
            const toneData = TONES.find(t => t.id === tone.getIdValue());
            if (toneData) setValue('tone', toneData);
          }}
          onCreateStory={handleToneContinue}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StoryCreationForm;
