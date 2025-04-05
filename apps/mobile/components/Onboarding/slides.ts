import { Theme, theme } from "@/config/theme";

export type Slide = {
  label: string;
  subTitle: string;
  right: boolean;
  color: keyof Theme["colors"];
  image: string;
}

export const slides: Slide[] = [
  {
    label: "Imaginer",
    subTitle: "Crée des histoires magiques et personnalisées pour ton enfant, avec son prénom, son âge, ses envies… Chaque aventure est unique.",
    right: false,
    color: "yellow",
    image: require("@/assets/images/onboarding/imagine.jpg")
  },
  {
    label: "Choisir",
    subTitle: "Thèmes, héros, langues… Laisse ton imagination choisir et l'app s'occupe du reste. Tu es le maître de l'aventure !",
    right: true,
    color: "tomato",
    image: require("@/assets/images/onboarding/choose.jpg")
  },
  {
    label: "Partager",
    subTitle: "Lis ou écoute les histoires avec ton enfant, à l'heure du coucher ou pour un moment doux. Des souvenirs magiques à créer ensemble.",
    right: false,
    color: "lightBlue",
    image: require("@/assets/images/onboarding/share.jpg")
  },
]