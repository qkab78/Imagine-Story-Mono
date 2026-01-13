import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import StepIndicator from '@/components/creation/StepIndicator';
import useStoryStore from '@/store/stories/storyStore';
import { createStory } from '@/api/stories/storyApi';
import { StoryFormMapper } from '@/features/stories/mappers/StoryFormMapper';
import useAuthStore from '@/store/auth/authStore';

/**
 * SummaryScreenNew - Écran récapitulatif avant génération
 *
 * Étape finale: Affiche tous les choix et permet de générer l'histoire.
 * Design modernisé avec cartes de résumé et bouton de génération.
 *
 * Route: /stories/creation/summary
 */
export const SummaryScreenNew: React.FC = () => {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const { createStoryPayload, resetCreateStoryPayload } = useStoryStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleGenerateStory = async () => {
    if (!createStoryPayload || !token) {
      setError('Données incomplètes pour générer l\'histoire');
      return;
    }

    // Validate required fields
    if (!createStoryPayload.hero?.name || !createStoryPayload.heroName ||
        !createStoryPayload.theme || !createStoryPayload.tone ||
        !createStoryPayload.age || !createStoryPayload.numberOfChapters) {
      setError('Veuillez compléter toutes les étapes avant de générer l\'histoire');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setSuccessMessage(null);

      // Map form data to backend payload
      const backendPayload = StoryFormMapper.toBackendPayload(
        createStoryPayload as any,
        token,
        user?.id
      );

      // Create story
      const response = await createStory(backendPayload, token);

      // Show success notification with backend message
      setSuccessMessage(response.message || 'Votre histoire est en cours de génération !');

      // Reset the creation payload
      resetCreateStoryPayload();

      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: any) {
      console.error('Error generating story:', err);
      setError(err.message || 'Une erreur est survenue lors de la génération de l\'histoire');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!createStoryPayload) {
    return (
      <LinearGradient
        colors={[colors.backgroundHome, colors.backgroundHomeEnd]}
        style={styles.gradient}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Aucune donnée de création trouvée</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.push('/stories/creation/hero-selection')}
          >
            <Text style={styles.errorButtonText}>Recommencer</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.backgroundHome, colors.backgroundHomeEnd]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <StepIndicator currentStep={4} totalSteps={4} />
        </View>

        {/* Summary Container */}
        <View style={styles.summaryContainer}>
          <View style={styles.headerSection}>
            <Text style={styles.stepLabel}>PRÊT À CRÉER !</Text>
            <Text style={styles.pageTitle}>Ton histoire</Text>
          </View>

          {/* Single Summary Card */}
          <View style={styles.summaryCard}>
            {/* Hero Header */}
            {createStoryPayload.hero && createStoryPayload.heroName && (
              <View style={styles.summaryHeader}>
                <View style={styles.heroAvatar}>
                  <Text style={styles.heroAvatarEmoji}>{createStoryPayload.hero.emoji}</Text>
                </View>
                <View style={styles.heroInfo}>
                  <Text style={styles.heroName}>{createStoryPayload.heroName}</Text>
                  <Text style={styles.heroSubtitle}>Héros de l'aventure</Text>
                </View>
              </View>
            )}

            {/* Details Section */}
            <View style={styles.detailsSection}>
              {/* Language Row */}
              {createStoryPayload.language && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Text style={styles.detailIconText}>{createStoryPayload.language.icon}</Text>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Langue</Text>
                    <Text style={styles.detailValue}>{createStoryPayload.language.name}</Text>
                  </View>
                </View>
              )}

              {/* Age Row */}
              {createStoryPayload.age && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Text style={styles.detailIconText}>🎂</Text>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Âge</Text>
                    <Text style={styles.detailValue}>{createStoryPayload.age} ans</Text>
                  </View>
                </View>
              )}

              {/* Theme Row */}
              {createStoryPayload.theme && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Text style={styles.detailIconText}>{createStoryPayload.theme.emoji}</Text>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Thème</Text>
                    <Text style={styles.detailValue}>{createStoryPayload.theme.name}</Text>
                  </View>
                </View>
              )}

              {/* Tone Row */}
              {createStoryPayload.tone && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Text style={styles.detailIconText}>{createStoryPayload.tone.emoji}</Text>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Ambiance</Text>
                    <Text style={styles.detailValue}>{createStoryPayload.tone.title}</Text>
                  </View>
                </View>
              )}

              {/* Chapters Row */}
              {createStoryPayload.numberOfChapters && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Text style={styles.detailIconText}>📚</Text>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Chapitres</Text>
                    <Text style={styles.detailValue}>{createStoryPayload.numberOfChapters} chapitres</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          {/* Success Display */}
          {successMessage && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerIcon}>✨</Text>
              <Text style={styles.successBannerText}>{successMessage}</Text>
            </View>
          )}
        </View>

        {/* Navigation Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.magicButton, (isGenerating || successMessage) && styles.magicButtonDisabled]}
            onPress={handleGenerateStory}
            disabled={isGenerating || !!successMessage}
            accessibilityRole="button"
          >
            <Text style={styles.magicButtonText}>
              <Text style={styles.magicIcon}>✨</Text>
              {isGenerating ? ' Génération...' : ' Créer mon histoire magique'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modifyButton}
            onPress={handleBack}
            disabled={isGenerating || !!successMessage}
            accessibilityRole="button"
          >
            <Text style={[styles.modifyButtonText, (isGenerating || successMessage) && styles.modifyButtonTextDisabled]}>
              Modifier
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading Overlay */}
        {isGenerating && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={colors.forestGreen} />
              <Text style={styles.loadingText}>
                Génération de ton histoire en cours...
              </Text>
              <Text style={styles.loadingHint}>
                Cela peut prendre quelques instants
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 248, 241, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  backIcon: {
    fontSize: 24,
    color: colors.forestGreen,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  progressContainer: {
    marginBottom: 32,
  },
  summaryContainer: {
    flex: 1,
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: 16,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginTop: 16,
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(127, 184, 160, 0.2)',
    marginBottom: 20,
  },
  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.warmAmber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.warmAmber,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  heroAvatarEmoji: {
    fontSize: 36,
  },
  heroInfo: {
    flex: 1,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  detailsSection: {
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    backgroundColor: colors.creamSurface,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIconText: {
    fontSize: 18,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  errorBannerText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  successBanner: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.forestGreen,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  successBannerIcon: {
    fontSize: 24,
  },
  successBannerText: {
    flex: 1,
    fontSize: 15,
    color: '#065F46',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 24,
  },
  magicButton: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 32,
    backgroundColor: colors.forestGreen,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.forestGreen,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 10,
  },
  magicButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  magicButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  magicIcon: {
    fontSize: 18,
  },
  modifyButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  modifyButtonTextDisabled: {
    opacity: 0.4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  errorButton: {
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 280,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  loadingHint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default SummaryScreenNew;
