/**
 * Types partagés pour la génération d'images
 *
 * Ces types sont utilisés par tous les providers d'images (Leonardo AI, Gemini, DALL-E, etc.)
 */

/**
 * Contexte de génération d'images
 * Contient toutes les informations nécessaires pour générer des images cohérentes
 */
export interface ImageGenerationContext {
  /** Titre de l'histoire */
  title: string

  /** Synopsis de l'histoire */
  synopsis: string

  /** Thème de l'histoire */
  theme: string

  /** Nom du protagoniste */
  protagonist: string

  /** Âge de l'enfant */
  childAge: number

  /** Espèce du protagoniste (humain, chat, chien, etc.) */
  species: string

  /** Langue de l'histoire */
  language: string

  /** Ton de l'histoire (joyeux, aventureux, etc.) */
  tone: string

  /** Slug unique de l'histoire */
  slug: string

  /** Nombre de chapitres */
  numberOfChapters: number

  /** Preset d'apparence (teint de peau pour les humains) */
  appearancePreset?: string

  /** Style d'illustration (japanese-soft, disney-pixar, watercolor, classic-book) */
  illustrationStyle?: string

  /** Character Visual Lock - description détaillée du personnage pour cohérence */
  characterVisualLock?: string
}

/**
 * Contenu d'un chapitre pour la génération d'image
 */
export interface ChapterContent {
  /** Titre du chapitre */
  title: string

  /** Contenu textuel du chapitre */
  content: string

  /** Index du chapitre (0-indexed) */
  index: number
}

/**
 * Résultat de génération de l'image de couverture
 * Contient le chemin de l'image et optionnellement le Character Visual Lock
 */
export interface CoverImageResult {
  /** Chemin de l'image de couverture (path relatif dans le storage) */
  imagePath: string

  /** Character Visual Lock - description détaillée du personnage pour cohérence entre images */
  characterVisualLock?: string
}

/**
 * Résultat de génération d'image pour un chapitre
 */
export interface ChapterImageResult {
  /** Index du chapitre (0-indexed) */
  chapterIndex: number

  /** Chemin de l'image générée (path relatif dans le storage) */
  imagePath: string

  /** Titre du chapitre (optionnel, pour traçabilité) */
  chapterTitle?: string
}

/**
 * Résultat de création d'une référence de personnage
 * Utilisé pour maintenir la cohérence visuelle entre les images
 */
export interface CharacterReferenceResult {
  /** Chemin de l'image de référence (path relatif dans le storage) */
  referenceImagePath: string

  /** ID de référence du provider (ex: initImageId pour Leonardo AI) */
  referenceId?: string

  /** Seed pour la génération déterministe */
  seed?: number
}

/**
 * Métadonnées de génération d'images de chapitres
 */
export interface ChapterImageGenerationMetadata {
  /** Nombre d'images générées avec succès */
  successfulGeneration: number

  /** Nombre total de chapitres */
  totalChapters: number

  /** Erreurs rencontrées durant la génération */
  errors: string[]

  /** Temps total de génération en millisecondes */
  generationTimeMs?: number
}

/**
 * Réponse complète de génération d'images de chapitres
 */
export interface ChapterImagesGenerationResponse {
  /** Images générées */
  images: ChapterImageResult[]

  /** Métadonnées de génération */
  metadata: ChapterImageGenerationMetadata
}
