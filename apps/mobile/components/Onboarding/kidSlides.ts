
export type KidSlide = {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  backgroundGradient: [string, string];
  features?: FeatureItem[];
  securityItems?: SecurityItem[];
  buttonText: string;
  buttonEmoji: string;
}

export type FeatureItem = {
  emoji: string;
  title: string;
  description: string;
  gradientColors: [string, string];
}

export type SecurityItem = {
  icon: string;
  title: string;
  description: string;
}

export const kidSlides: KidSlide[] = [
  {
    id: 1,
    emoji: "📚",
    title: "Bienvenue dans Mon Petit Conteur !",
    subtitle: "L'app magique qui crée des histoires merveilleuses rien que pour votre enfant",
    backgroundGradient: ["#FF6B9D", "#FFB74D"],
    buttonText: "C'est parti !",
    buttonEmoji: "🚀",
  },
  {
    id: 2,
    emoji: "🪄",
    title: "Créer une histoire, c'est facile !",
    subtitle: "En 3 étapes simples, votre enfant aura sa propre histoire magique",
    backgroundGradient: ["#E8F5E8", "#F0FFF0"],
    features: [
      {
        emoji: "🧚‍♀️",
        title: "1. Choisis ton héros",
        description: "Princesse, dragon, pirate...",
        gradientColors: ["#9C27B0", "#E91E63"],
      },
      {
        emoji: "🎨",
        title: "2. Dis-nous ton rêve",
        description: "Quelques mots suffisent !",
        gradientColors: ["#2196F3", "#03DAC6"],
      },
      {
        emoji: "📖",
        title: "3. Lis ton histoire",
        description: "Ton histoire au bout des doigts",
        gradientColors: ["#FF9800", "#FF5722"],
      },
    ],
    buttonText: "J'ai compris !",
    buttonEmoji: "😊",
  },
  {
    id: 3,
    emoji: "🛡️",
    title: "Parents, soyez rassurés !",
    subtitle: "Votre enfant explore en toute sécurité notre application",
    backgroundGradient: ["#E3F2FD", "#F0F8FF"],
    securityItems: [
      {
        icon: "🔒",
        title: "Mode hors-ligne :",
        description: "Lisez vos histoires sans connexion",
      },
      {
        icon: "👥",
        title: "Contrôle parental :",
        description: "Vous gérez tout",
      },
      {
        icon: "🎯",
        title: "Adapté à l'âge :",
        description: "Vocabulaire et thèmes 3-8 ans",
      },
    ],
    buttonText: "Commencer l'aventure !",
    buttonEmoji: "🌟",
  },
];