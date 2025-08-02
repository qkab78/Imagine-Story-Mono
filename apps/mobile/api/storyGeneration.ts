import { StoryCreationRequest, StoryCreationResponse, GeneratedStory } from '@/types/creation';

// Simuler un délai d'API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Données fictives pour simuler la génération d'histoire
const generateFakeStoryContent = (request: StoryCreationRequest): string => {
  const { hero, heroName, theme, tone, age, numberOfChapters } = request;
  
  const introductions = {
    happy: `Il était une fois ${heroName} ${hero.emoji}, un petit héros plein de joie qui adorait les aventures amusantes.`,
    calm: `Dans un monde paisible et serein, vivait ${heroName} ${hero.emoji}, un personnage doux et bienveillant.`,
    mysterious: `Par une nuit étoilée, ${heroName} ${hero.emoji} découvrit un mystère fascinant qui allait changer sa vie.`,
    adventurous: `${heroName} ${hero.emoji} était connu dans tout le royaume pour son courage et sa soif d'aventure.`
  };

  const adventures: Record<string, string> = {
    '1': `Dans le royaume magique ${theme.emoji}, ${heroName} rencontra une princesse qui avait perdu sa couronne enchantée.`,
    '2': `En naviguant sur les océans ${theme.emoji}, ${heroName} découvrit une île mystérieuse remplie de trésors.`,
    '3': `Au cœur de la forêt enchantée ${theme.emoji}, ${heroName} se lia d'amitié avec des animaux parlants.`,
    '4': `Dans l'espace infini ${theme.emoji}, ${heroName} rencontra des extraterrestres bienveillants.`,
    '5': `À l'époque des dinosaures ${theme.emoji}, ${heroName} apprit à communiquer avec ces géants préhistoriques.`,
    '6': `À l'école ${theme.emoji}, ${heroName} découvrit qu'il avait des pouvoirs spéciaux pour aider ses amis.`
  };

  const conclusions = {
    happy: `Et depuis ce jour, ${heroName} vécut heureux, entouré de rires et d'amis fidèles.`,
    calm: `${heroName} rentra chez lui le cœur apaisé, ayant trouvé la paix intérieure.`,
    mysterious: `Le mystère était enfin résolu, mais ${heroName} savait que d'autres énigmes l'attendaient.`,
    adventurous: `Cette aventure était terminée, mais ${heroName} savait que de nouveaux défis l'attendaient au tournant.`
  };

  // Générer du contenu selon le nombre de chapitres
  let storyContent = `${introductions[tone.mood]}\n\n`;
  
  for (let i = 1; i <= numberOfChapters; i++) {
    storyContent += `**Chapitre ${i}**\n\n`;
    storyContent += `${adventures[theme.id]}\n\n`;
    
    if (i === numberOfChapters) {
      storyContent += `${conclusions[tone.mood]}`;
    } else {
      storyContent += `${heroName} se prépare pour la suite de son aventure...\n\n`;
    }
  }

  return storyContent;
};

// Service API fictif pour la génération d'histoire
export const createStory = async (request: StoryCreationRequest): Promise<StoryCreationResponse> => {
  try {
    // Simuler un délai d'API de 6 secondes
    await delay(6000);
    
    // Simuler une erreur occasionnelle (10% de chance)
    if (Math.random() < 0.1) {
      throw new Error('Erreur de génération: Service temporairement indisponible');
    }

    const story: GeneratedStory = {
      id: `story-${Date.now()}`,
      title: `Les Aventures de ${request.heroName} (${request.age} ans)`,
      content: generateFakeStoryContent(request),
      coverUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${request.heroName}&backgroundColor=b6e3f4`,
      audioUrl: undefined, // Sera généré plus tard
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      story,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de la génération',
    };
  }
};

// Étapes de génération avec durées réelles
export const GENERATION_STEPS = [
  { id: '1', title: 'Création du personnage', duration: 1000 },
  { id: '2', title: 'Construction de l\'univers', duration: 1500 },
  { id: '3', title: 'Écriture de l\'histoire', duration: 2000 },
  { id: '4', title: 'Génération des illustrations', duration: 1500 },
] as const;