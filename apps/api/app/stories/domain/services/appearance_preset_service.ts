/**
 * Appearance Preset Service
 *
 * Provides skin tone presets for human character generation.
 * Used to inject appearance descriptions into image generation prompts.
 */

/**
 * Available skin tone preset identifiers
 */
export type SkinTonePresetId =
  | 'light'
  | 'light-medium'
  | 'medium'
  | 'medium-tan'
  | 'tan'
  | 'deep'

/**
 * Skin tone preset definition
 */
export interface SkinTonePreset {
  /** Unique identifier */
  id: SkinTonePresetId
  /** Display name (English) */
  name: string
  /** Hex color code for UI display */
  color: string
  /** Description for AI image generation prompts */
  description: string
}

/**
 * All available skin tone presets
 */
export const SKIN_TONE_PRESETS: Record<SkinTonePresetId, SkinTonePreset> = {
  light: {
    id: 'light',
    name: 'Light',
    color: '#FFDFC4',
    description: 'Fair peachy skin with rosy pink cheeks',
  },
  'light-medium': {
    id: 'light-medium',
    name: 'Light Medium',
    color: '#F0C8A0',
    description: 'Warm beige skin with subtle healthy glow',
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    color: '#D4A574',
    description: 'Golden brown skin with warm undertones',
  },
  'medium-tan': {
    id: 'medium-tan',
    name: 'Medium Tan',
    color: '#C68642',
    description: 'Warm caramel skin with rich undertones',
  },
  tan: {
    id: 'tan',
    name: 'Tan',
    color: '#8D5524',
    description: 'Rich brown skin with warm chocolate undertones',
  },
  deep: {
    id: 'deep',
    name: 'Deep',
    color: '#4A2C2A',
    description: 'Deep dark brown skin with warm undertones',
  },
}

/**
 * Human species that support skin tone selection
 */
export const HUMAN_SPECIES = ['girl', 'boy', 'superhero', 'superheroine'] as const
export type HumanSpecies = (typeof HUMAN_SPECIES)[number]

/**
 * Appearance Preset Service
 *
 * Provides methods for working with skin tone presets in character generation.
 */
export class AppearancePresetService {
  /**
   * Default skin tone preset ID
   */
  static readonly DEFAULT_PRESET: SkinTonePresetId = 'light'

  /**
   * Check if a species supports skin tone selection
   */
  static isHumanSpecies(species: string): species is HumanSpecies {
    return HUMAN_SPECIES.includes(species.toLowerCase() as HumanSpecies)
  }

  /**
   * Get a skin tone preset by ID
   * @param presetId The preset ID to look up
   * @returns The preset definition, or the default preset if not found
   */
  static getPreset(presetId?: string | null): SkinTonePreset {
    if (!presetId || !(presetId in SKIN_TONE_PRESETS)) {
      return SKIN_TONE_PRESETS[this.DEFAULT_PRESET]
    }
    return SKIN_TONE_PRESETS[presetId as SkinTonePresetId]
  }

  /**
   * Get all available presets
   */
  static getAllPresets(): SkinTonePreset[] {
    return Object.values(SKIN_TONE_PRESETS)
  }

  /**
   * Build the skin tone description for image generation prompts
   *
   * @param presetId The skin tone preset ID
   * @param species The character species
   * @returns The skin tone line for the prompt, or empty string for non-human species
   */
  static buildSkinTonePromptLine(presetId?: string | null, species?: string): string {
    // Only apply skin tone to human species
    if (!species || !this.isHumanSpecies(species)) {
      return ''
    }

    const preset = this.getPreset(presetId)
    return `- Skin tone: ${preset.description} (${preset.color}) with rosy pink cheeks`
  }

  /**
   * Build a full appearance section for prompts
   *
   * @param presetId The skin tone preset ID
   * @param species The character species
   * @returns An appearance section string for prompts
   */
  static buildAppearancePromptSection(presetId?: string | null, species?: string): string {
    if (!species || !this.isHumanSpecies(species)) {
      return ''
    }

    const preset = this.getPreset(presetId)

    return `
SKIN TONE (CRITICAL - MUST MATCH EXACTLY):
${this.buildSkinTonePromptLine(presetId, species)}
The skin tone is a DEFINING characteristic and must remain consistent across all illustrations.
`
  }

  /**
   * Validate a preset ID
   * @returns true if valid, false otherwise
   */
  static isValidPresetId(presetId: string): presetId is SkinTonePresetId {
    return presetId in SKIN_TONE_PRESETS
  }
}
