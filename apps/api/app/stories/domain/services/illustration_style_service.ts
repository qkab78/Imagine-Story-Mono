/**
 * Illustration Style Service
 *
 * Maps illustration style IDs to optimized prompts for consistent image generation.
 * Each style has a short, focused prompt (~30 lines instead of 100+) that defines:
 * - Visual style characteristics
 * - Color palette guidelines
 * - Prohibited elements to avoid
 */
export class IllustrationStyleService {
  /**
   * Available illustration styles with their prompt definitions
   */
  private static readonly STYLE_PROMPTS: Record<string, string> = {
    'japanese-soft': `STYLE : Illustration enfant, style japonais doux, couleurs pastel chaudes.
Proportions chibi (tête = 1/4 du corps), grands yeux expressifs ronds, contours arrondis doux.
Lumière douce et chaleureuse, atmosphère magique et féérique.
Ombres légères rosées ou lavande, highlights blancs délicats.
Textures douces sans détails durs, rendu aquarelle numérique.
INTERDIT : Anime hardcore, réaliste, flat vector, couleurs sombres, contours anguleux.`,

    'disney-pixar': `STYLE : Illustration enfant, style Pixar/Disney moderne adapté en 2D.
Couleurs saturées vibrantes, personnages expressifs avec reflets dans les yeux.
Éclairage cinématique volumétrique, ombres douces et profondes.
Rendu semi-3D avec subsurface scattering sur la peau, cheveux avec dynamisme.
Expressions faciales très lisibles, poses dynamiques et engageantes.
INTERDIT : Flat vector, couleurs ternes, style cartoon exagéré, rendu 3D trop réaliste.`,

    watercolor: `STYLE : Illustration enfant, style aquarelle traditionnelle authentique.
Couleurs douces et transparentes avec dégradés naturels, texture papier visible.
Contours légers esquissés au crayon, zones de blanc du papier préservées.
Atmosphère poétique et délicate, comme peint à la main avec de vraies aquarelles.
Bleeding naturel entre les couleurs, effet wet-on-wet subtil.
INTERDIT : Couleurs saturées opaques, lignes dures numériques, style digital évident.`,

    'classic-book': `STYLE : Illustration enfant, style livre classique européen type Beatrix Potter.
Couleurs riches et chaudes avec patine vintage, détails soignés et précis.
Proportions réalistes pour enfants, expressions douces et naturelles.
Éclairage naturel doré, ambiance intemporelle et chaleureuse.
Rendu traditionnel avec hachures fines, textures organiques.
INTERDIT : Style cartoon, couleurs néon, proportions exagérées, rendu digital.`,
  }

  /**
   * Default style to use if an invalid style is provided
   */
  private static readonly DEFAULT_STYLE = 'japanese-soft'

  /**
   * Get the prompt segment for a given illustration style
   * @param style - The illustration style ID
   * @returns The corresponding style prompt
   */
  public static getStylePrompt(style: string | undefined): string {
    if (!style || !this.STYLE_PROMPTS[style]) {
      return this.STYLE_PROMPTS[this.DEFAULT_STYLE]
    }
    return this.STYLE_PROMPTS[style]
  }

  /**
   * Check if a given style ID is valid
   * @param style - The illustration style ID to validate
   * @returns True if the style is valid
   */
  public static isValidStyle(style: string): boolean {
    return style in this.STYLE_PROMPTS
  }

  /**
   * Get all available style IDs
   * @returns Array of valid style IDs
   */
  public static getAvailableStyles(): string[] {
    return Object.keys(this.STYLE_PROMPTS)
  }

  /**
   * Get the default style ID
   * @returns The default style ID
   */
  public static getDefaultStyle(): string {
    return this.DEFAULT_STYLE
  }
}
