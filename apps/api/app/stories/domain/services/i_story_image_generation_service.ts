import type {
  ImageGenerationContext,
  ChapterContent,
  ChapterImagesGenerationResponse,
  CharacterReferenceResult,
  CoverImageResult,
} from './types/image_generation_types.js'

/**
 * Interface pour les services de génération d'images
 *
 * Cette interface permet de découpler la logique de génération d'images du provider spécifique.
 * Elle peut être implémentée par différents providers (Leonardo AI, Gemini Imagen, DALL-E, etc.)
 *
 * @example
 * // Utilisation avec Leonardo AI
 * const imageService = container.make(LeonardoAiImageGenerationService)
 * const coverPath = await imageService.generateCoverImage(context)
 *
 * @example
 * // Utilisation avec Gemini
 * const imageService = container.make(GeminiImageGenerationService)
 * const coverPath = await imageService.generateCoverImage(context)
 */
export abstract class IStoryImageGenerationService {
  /**
   * Génère l'image de couverture de l'histoire
   *
   * @param context - Contexte de génération contenant les informations de l'histoire
   * @param characterReference - Référence optionnelle du personnage pour cohérence visuelle
   * @returns Résultat avec le chemin de l'image et optionnellement le Character Visual Lock
   *
   * @throws Error si la génération échoue
   */
  abstract generateCoverImage(
    context: ImageGenerationContext,
    characterReference?: CharacterReferenceResult
  ): Promise<CoverImageResult>

  /**
   * Génère toutes les images des chapitres
   *
   * @param context - Contexte de génération contenant les informations de l'histoire
   * @param chapters - Liste des chapitres avec leur contenu
   * @param characterReference - Référence optionnelle du personnage pour cohérence visuelle
   * @returns Réponse avec les images générées et les métadonnées
   *
   * @throws Error si la génération échoue complètement
   */
  abstract generateChapterImages(
    context: ImageGenerationContext,
    chapters: ChapterContent[],
    characterReference?: CharacterReferenceResult
  ): Promise<ChapterImagesGenerationResponse>

  /**
   * Crée une référence de personnage pour maintenir la cohérence visuelle
   *
   * Cette méthode est optionnelle - certains providers peuvent ne pas supporter
   * les références de personnages (init images). Dans ce cas, retourner undefined.
   *
   * @param context - Contexte de génération contenant les informations du personnage
   * @returns Résultat avec l'image de référence et son ID, ou undefined si non supporté
   *
   * @throws Error si la génération échoue (seulement si le provider supporte cette feature)
   */
  abstract createCharacterReference(
    context: ImageGenerationContext
  ): Promise<CharacterReferenceResult | undefined>

  /**
   * Teste la connexion au provider d'images
   *
   * @returns true si le provider est accessible, false sinon
   */
  abstract testConnection(): Promise<boolean>

  /**
   * Retourne le nom du provider
   *
   * @returns Nom du provider (ex: 'Leonardo AI', 'Gemini Imagen', 'DALL-E')
   */
  abstract getProviderName(): string
}
