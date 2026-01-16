/**
 * Utilitaires de validation pour les formulaires d'authentification
 */

/**
 * Valide un email
 * @param email - Email à valider
 * @returns true si l'email est valide
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un mot de passe
 * @param password - Mot de passe à valider
 * @returns Objet avec isValid et message d'erreur si invalide
 */
export const validatePassword = (
  password: string
): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Ton mot de passe doit avoir au moins 8 caractères 🔐',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Ton mot de passe doit contenir une majuscule 🔠',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Ton mot de passe doit contenir un chiffre 🔢',
    };
  }

  return { isValid: true };
};

/**
 * Vérifie que deux mots de passe correspondent
 * @param password - Mot de passe
 * @param passwordConfirm - Confirmation du mot de passe
 * @returns true si les mots de passe correspondent
 */
export const validatePasswordMatch = (
  password: string,
  passwordConfirm: string
): boolean => {
  return password === passwordConfirm;
};

/**
 * Valide un nom (prénom ou nom de famille)
 * @param name - Nom à valider
 * @returns Objet avec isValid et message d'erreur si invalide
 */
export const validateName = (
  name: string,
  fieldName: string = 'nom'
): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return {
      isValid: false,
      error: 'Ce champ est obligatoire ⚠️',
    };
  }

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: `Le ${fieldName} doit avoir au moins 2 caractères ✏️`,
    };
  }

  // Optionnel: vérifier les caractères spéciaux (autoriser tiret et apostrophe)
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: `Le ${fieldName} contient des caractères non autorisés ⚠️`,
    };
  }

  return { isValid: true };
};

/**
 * Messages d'erreur standardisés
 */
export const ERROR_MESSAGES = {
  REQUIRED: 'Ce champ est obligatoire ⚠️',
  INVALID_EMAIL: "Oups ! Cet email n'a pas l'air correct 📧",
  PASSWORD_TOO_SHORT: 'Ton mot de passe doit avoir au moins 8 caractères 🔐',
  PASSWORD_NO_UPPERCASE: 'Ton mot de passe doit contenir une majuscule 🔠',
  PASSWORD_NO_NUMBER: 'Ton mot de passe doit contenir un chiffre 🔢',
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas 🤔',
  NAME_TOO_SHORT: 'Ce nom doit avoir au moins 2 caractères ✏️',
  INVALID_CHARACTERS: 'Ce champ contient des caractères non autorisés ⚠️',
} as const;
