import { theme } from "@/config/theme";

export type Slide = {
  label: string;
  subTitle: string;
  right: boolean;
  color: string;
}

export const slides: Slide[] = [
  {
    label: "Imaginer",
    subTitle: "Crée des histoires magiques et personnalisées pour ton enfant, avec son prénom, son âge, ses envies… Chaque aventure est unique.",
    right: false,
    color: theme.colors.mainBackground
  },
  {
    label: "Choisir",
    subTitle: "Thèmes, héros, langues… Laisse ton imagination choisir et l'app s'occupe du reste. Tu es le maître de l'aventure !",
    right: true,
    color: theme.colors.textTertiary
  },
  {
    label: "Partager",
    subTitle: "Lis ou écoute les histoires avec ton enfant, à l'heure du coucher ou pour un moment doux. Des souvenirs magiques à créer ensemble.",
    right: false,
    color: theme.colors.tomato
  },
]