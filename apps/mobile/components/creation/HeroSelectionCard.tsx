import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Adapt, Select as TamaguiSelect, Sheet, YStack } from 'tamagui';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import { Control, useController } from 'react-hook-form';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { Hero, StoryCreationFormData, AGE_OPTIONS, CHAPTERS_OPTIONS } from '@/types/creation';
import Text from '@/components/ui/Text';
import KidButton from '@/components/Onboarding/KidButton';
import Box from '../ui/Box';
import { ALLOWED_LANGUAGES } from '@imagine-story/api/app/stories/constants/allowed_languages';

interface HeroSelectionCardProps {
  heroes: Hero[];
  selectedHero: Hero | null;
  onHeroSelect: (hero: Hero) => void;
  heroName: string;
  onNameChange: (name: string) => void;
  onLanguageChange: (language: string) => void;
  onContinue: () => void;
  control: Control<StoryCreationFormData>;
}

const languages = [
  { label: '🇫🇷 Français', value: ALLOWED_LANGUAGES.FR },
  { label: '🇬🇧 Anglais', value: ALLOWED_LANGUAGES.EN },
  { label: '🇪🇸 Espagnol', value: ALLOWED_LANGUAGES.ES },
  { label: '🇩🇪 Allemand', value: ALLOWED_LANGUAGES.DE },
  { label: '🇮🇹 Italien', value: ALLOWED_LANGUAGES.IT },
  { label: '🇵🇹 Portugais', value: ALLOWED_LANGUAGES.PT },
  { label: '🇨🇩 Lingala', value: ALLOWED_LANGUAGES.LI },
  { label: '🇳🇱 Néerlandais', value: ALLOWED_LANGUAGES.NL },
  { label: '🇵🇱 Polonais', value: ALLOWED_LANGUAGES.PL },
  { label: '🇷🇺 Russe', value: ALLOWED_LANGUAGES.RU },
  { label: '🇹🇷 Turc', value: ALLOWED_LANGUAGES.TR },
  { label: '🇦🇪 Arabe', value: ALLOWED_LANGUAGES.AR },
  { label: '🇯🇵 Japonais', value: ALLOWED_LANGUAGES.JA },
];

const HeroSelectionCard: React.FC<HeroSelectionCardProps> = ({
  heroes,
  selectedHero,
  onHeroSelect,
  heroName,
  onNameChange,
  onLanguageChange,
  onContinue,
  control,
}) => {
  const inputScale = useSharedValue(1);
  const inputShadow = useSharedValue(0);
  const selectScale = useSharedValue(1);
  const selectShadow = useSharedValue(0);
  
  // Utilisation du controller pour le champ langue
  const { field: languageField } = useController({
    name: 'language',
    control,
  });

  const { field: heroNameField, fieldState: heroNameFieldState } = useController({
    name: 'heroName',
    control,
    rules: {
      required: "Le nom de ton héros est requis",
      minLength: {
        value: 3,
        message: "Le nom de ton héros doit contenir au moins 3 caractères",
      },
    },
  });

  const { field: ageField } = useController({
    name: 'age',
    control,
    defaultValue: 5,
  });

  const { field: chaptersField } = useController({
    name: 'numberOfChapters',
    control,
    defaultValue: 3,
  });

  const handleHeroPress = (hero: Hero) => {
    onHeroSelect(hero);
  };

  const handleInputFocus = () => {
    inputScale.value = withTiming(1.02, { duration: 200 });
    inputShadow.value = withTiming(0.2, { duration: 200 });
  };

  const handleInputBlur = () => {
    inputScale.value = withTiming(1, { duration: 200 });
    inputShadow.value = withTiming(0, { duration: 200 });
  };

  const handleSelectOpen = () => {
    selectScale.value = withTiming(1.02, { duration: 200 });
    selectShadow.value = withTiming(0.2, { duration: 200 });
  };

  const handleSelectClose = () => {
    selectScale.value = withTiming(1, { duration: 200 });
    selectShadow.value = withTiming(0, { duration: 200 });
  };

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
    shadowOpacity: inputShadow.value,
  }));

  const selectAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectScale.value }],
    shadowOpacity: selectShadow.value,
  }));

  return (
    <Box style={styles.container}>
      <View style={styles.heroGrid}>
        {heroes.map((hero) => {
          const isSelected = selectedHero?.id === hero.id;

          return (
            <TouchableOpacity
              key={hero.id}
              style={[
                styles.heroOption,
                isSelected && styles.heroSelected,
              ]}
              onPress={() => handleHeroPress(hero)}
              activeOpacity={0.8}
              accessibilityLabel={`Choisir ${hero.name}`}
              accessibilityRole="button"
            >
              {/* @ts-ignore */}
              <LinearGradient
                colors={
                  isSelected
                    ? [colors.primaryPink, colors.secondaryOrange]
                    : [colors.secondaryOrange, '#FF8A65']
                }
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.heroEmoji}>{hero.emoji}</Text>
                <Text style={styles.heroName}>{hero.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      <Animated.View style={[styles.inputContainer, inputAnimatedStyle]}>
        <Box alignItems="flex-start" gap="s">
          <Text style={styles.heroNameLabel}>{`Nom de ton héros`}</Text>
          <TextInput
            style={[styles.textInput, heroNameFieldState.error && styles.errorInput]}
            value={heroNameField.value}
            onChangeText={heroNameField.onChange}
            placeholder={`${selectedHero?.emoji || '✨'} Comment s'appelle ton héros ?`}
            placeholderTextColor={colors.textMuted}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            maxLength={20}
            accessibilityLabel="Nom du héros"
          />
          {heroNameFieldState.error && (
            <Text style={styles.errorText}>{heroNameFieldState.error.message}</Text>
          )}
        </Box>
      </Animated.View>

      <Animated.View style={[styles.inputContainer, selectAnimatedStyle]}>
        <Box alignItems="flex-start" gap="s">
          <Text style={styles.heroNameLabel}>{`Langue de l'histoire`}</Text>
          <TamaguiSelect 
            value={languageField.value}
            onValueChange={languageField.onChange}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                handleSelectOpen();
              } else {
                handleSelectClose();
              }
            }}
            disablePreventBodyScroll
          >
            <TamaguiSelect.Trigger 
              iconAfter={ArrowDown} 
              style={styles.selectTrigger}
            >
              <TamaguiSelect.Value 
                placeholder="Choisir une langue 🌍"
                style={styles.selectValue}
              />
            </TamaguiSelect.Trigger>

            <Adapt platform="touch">
              <Sheet native modal dismissOnSnapToBottom animation="medium">
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay
                  backgroundColor="rgba(0,0,0,0.5)"
                  animation="lazy"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Sheet>
            </Adapt>

            <TamaguiSelect.Content zIndex={200000}>
              <TamaguiSelect.ScrollUpButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <YStack zIndex={10}>
                  <ArrowUp size={20} />
                </YStack>
              </TamaguiSelect.ScrollUpButton>
              
              <TamaguiSelect.Viewport minWidth={200}>
                <TamaguiSelect.Group>
                  <TamaguiSelect.Label>
                    <Text style={styles.selectLabel}>Langues disponibles</Text>
                  </TamaguiSelect.Label>
                  
                  {languages.map((language, index) => (
                    <TamaguiSelect.Item key={language.value} value={language.value} index={index}>
                      <TamaguiSelect.ItemText>
                        <Text style={styles.selectItemText}>{language.label}</Text>
                      </TamaguiSelect.ItemText>
                    </TamaguiSelect.Item>
                  ))}
                </TamaguiSelect.Group>
              </TamaguiSelect.Viewport>
              
              <TamaguiSelect.ScrollDownButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <YStack zIndex={10}>
                  <ArrowDown size={20} />
                </YStack>
              </TamaguiSelect.ScrollDownButton>
            </TamaguiSelect.Content>
          </TamaguiSelect>
        </Box>
      </Animated.View>

      <Animated.View style={[styles.inputContainer, selectAnimatedStyle]}>
        <Box alignItems="flex-start" gap="s">
          <Text style={styles.heroNameLabel}>{`Âge de l'enfant`}</Text>
          <TamaguiSelect 
            value={String(ageField.value)}
            onValueChange={(value) => ageField.onChange(Number(value))}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                handleSelectOpen();
              } else {
                handleSelectClose();
              }
            }}
            disablePreventBodyScroll
          >
            <TamaguiSelect.Trigger 
              iconAfter={ArrowDown} 
              style={styles.selectTrigger}
            >
              <TamaguiSelect.Value 
                placeholder="Choisir un âge 👶"
                style={styles.selectValue}
              />
            </TamaguiSelect.Trigger>

            <Adapt platform="touch">
              <Sheet native modal dismissOnSnapToBottom animation="medium">
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay
                  backgroundColor="rgba(0,0,0,0.5)"
                  animation="lazy"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Sheet>
            </Adapt>

            <TamaguiSelect.Content zIndex={200000}>
              <TamaguiSelect.ScrollUpButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <YStack zIndex={10}>
                  <ArrowUp size={20} />
                </YStack>
              </TamaguiSelect.ScrollUpButton>
              
              <TamaguiSelect.Viewport minWidth={200}>
                <TamaguiSelect.Group>
                  <TamaguiSelect.Label>
                    <Text style={styles.selectLabel}>Âges disponibles</Text>
                  </TamaguiSelect.Label>
                  
                  {AGE_OPTIONS.map((ageOption, index) => (
                    <TamaguiSelect.Item key={ageOption.value} value={String(ageOption.value)} index={index}>
                      <TamaguiSelect.ItemText>
                        <Text style={styles.selectItemText}>{ageOption.label}</Text>
                      </TamaguiSelect.ItemText>
                    </TamaguiSelect.Item>
                  ))}
                </TamaguiSelect.Group>
              </TamaguiSelect.Viewport>
              
              <TamaguiSelect.ScrollDownButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <YStack zIndex={10}>
                  <ArrowDown size={20} />
                </YStack>
              </TamaguiSelect.ScrollDownButton>
            </TamaguiSelect.Content>
          </TamaguiSelect>
        </Box>
      </Animated.View>

      <Animated.View style={[styles.inputContainer, selectAnimatedStyle]}>
        <Box alignItems="flex-start" gap="s">
          <Text style={styles.heroNameLabel}>{`Nombre de chapitres`}</Text>
          <TamaguiSelect 
            value={String(chaptersField.value)}
            onValueChange={(value) => chaptersField.onChange(Number(value))}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                handleSelectOpen();
              } else {
                handleSelectClose();
              }
            }}
            disablePreventBodyScroll
          >
            <TamaguiSelect.Trigger 
              iconAfter={ArrowDown} 
              style={styles.selectTrigger}
            >
              <TamaguiSelect.Value 
                placeholder="Choisir le nombre de chapitres 📚"
                style={styles.selectValue}
              />
            </TamaguiSelect.Trigger>

            <Adapt platform="touch">
              <Sheet native modal dismissOnSnapToBottom animation="medium">
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay
                  backgroundColor="rgba(0,0,0,0.5)"
                  animation="lazy"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Sheet>
            </Adapt>

            <TamaguiSelect.Content zIndex={200000}>
              <TamaguiSelect.ScrollUpButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <YStack zIndex={10}>
                  <ArrowUp size={20} />
                </YStack>
              </TamaguiSelect.ScrollUpButton>
              
              <TamaguiSelect.Viewport minWidth={200}>
                <TamaguiSelect.Group>
                  <TamaguiSelect.Label>
                    <Text style={styles.selectLabel}>Nombre de chapitres</Text>
                  </TamaguiSelect.Label>
                  
                  {CHAPTERS_OPTIONS.map((chapterOption, index) => (
                    <TamaguiSelect.Item key={chapterOption.value} value={String(chapterOption.value)} index={index}>
                      <TamaguiSelect.ItemText>
                        <Text style={styles.selectItemText}>{chapterOption.label}</Text>
                      </TamaguiSelect.ItemText>
                    </TamaguiSelect.Item>
                  ))}
                </TamaguiSelect.Group>
              </TamaguiSelect.Viewport>
              
              <TamaguiSelect.ScrollDownButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <YStack zIndex={10}>
                  <ArrowDown size={20} />
                </YStack>
              </TamaguiSelect.ScrollDownButton>
            </TamaguiSelect.Content>
          </TamaguiSelect>
        </Box>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <KidButton
          title="Continuer l'aventure !"
          emoji="🚀"
          onPress={onContinue}
        />
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    flex: 1,
  },

  heroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  heroOption: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: spacing.base,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
  },

  heroSelected: {
    borderColor: colors.primaryPink,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
  },

  heroEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },

  heroName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  heroNameLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  inputContainer: {
    marginBottom: spacing.xl,
  },

  textInput: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.base,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    width: '100%',
  },

  buttonContainer: {
    marginTop: 'auto',
  },

  selectTrigger: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.base,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    width: '100%',
    minHeight: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectValue: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  selectLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  selectItemText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  errorText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.error,
  },

  errorInput: {
    borderColor: colors.error,
  },
});

export default HeroSelectionCard;