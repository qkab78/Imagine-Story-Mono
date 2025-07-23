import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALLOWED_LANGUAGES, createStory, THEMES, type CreateStoryFormData } from "@/api/stories";
import { Dimensions, Alert } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "../ui/Box";
import TextInput from "../ui/TextInput";
import { Baby, BookOpen, Film, Layers, User, Crown, Heart, Star } from "lucide-react-native";
import Text from "../ui/Text";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/config/theme";
import Slider from "../ui/Slider";
import Button from "../ui/Button";
import Select from "../ui/Select";
import MagicalThemeSelector from "./MagicalThemeSelector";
import MagicalFormField from "./MagicalFormField";
import MagicalButton from "../home/MagicalButton";

const schema = z.object({
  title: z.string().min(3),
  synopsis: z.string().min(3),
  theme: z.string().min(3),
  protagonist: z.string().min(3),
  childAge: z.number().min(3),
  numberOfChapters: z.number().min(3).max(5),
  language: z.enum(['FR', 'EN', 'LI']),
});
const { width, height } = Dimensions.get('window');
const WIDTH = width * 0.8;
const TEXT_AREA_LIMIT = 4;

export const CreatStoryForm = () => {
  const theme = useTheme<Theme>();
  const token = useAuthStore((state) => state.token!);
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: CreateStoryFormData) => createStory({ ...data, token }),
    onSuccess: () => {
      Alert.alert(
        '🎉 Histoire Créée!',
        'Ton histoire magique est en cours de création! Elle sera bientôt prête.',
        [{ text: 'Génial!', style: 'default' }]
      );
    },
    onError: () => {
      Alert.alert(
        '😔 Oups!',
        'Il y a eu un petit problème. Peux-tu réessayer?',
        [{ text: 'Réessayer', style: 'default' }]
      );
    }
  })

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Omit<CreateStoryFormData, 'token'>>({
    defaultValues: {
      title: '',
      synopsis: '',
      theme: '',
      protagonist: '',
      childAge: 3,
      numberOfChapters: 1,
      language: 'FR',
    },
    resolver: zodResolver(schema),
    mode: "onBlur"
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    mutation.mutate({
      ...data,
      token
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['stories', token] });
        reset();
      }
    });
  };


  return (
    <Box flex={1} gap={"xl"}>
      {/* Magical Theme Selection */}
      <MagicalFormField
        label=""
        error={errors.theme?.message}
      >
        <MagicalThemeSelector control={control} name="theme" />
      </MagicalFormField>

      {/* Title */}
      <MagicalFormField
        label="Titre de ton histoire"
        icon={<Crown size={20} color="#F59E0B" />}
        error={errors.title?.message}
      >
        <TextInput 
          name="title" 
          placeholder="Ex: La Princesse et le Dragon Magique" 
          control={control} 
          Icon={BookOpen}
        />
      </MagicalFormField>

      {/* Protagonist */}
      <MagicalFormField
        label="Nom de ton héros/héroïne"
        icon={<Heart size={20} color="#EF4444" />}
        error={errors.protagonist?.message}
      >
        <TextInput 
          name="protagonist" 
          placeholder="Ex: Princesse Luna, Capitaine Paul..." 
          control={control} 
          Icon={User}
        />
      </MagicalFormField>

      {/* Synopsis */}
      <MagicalFormField
        label="Raconte-nous ton idée d'histoire"
        icon={<Star size={20} color="#8B5CF6" />}
        error={errors.synopsis?.message}
      >
        <TextInput
          name="synopsis"
          placeholder="Il était une fois... Décris ton aventure magique!"
          control={control}
          Icon={Film}
          multiline
          numberOfLines={TEXT_AREA_LIMIT}
        />
      </MagicalFormField>

      {/* Child age */}
      <MagicalFormField
        label="Quel âge as-tu?"
        icon={<Baby size={20} color="#10B981" />}
        error={errors.childAge?.message}
      >
        <Slider name="childAge" control={control} text="ans" />
      </MagicalFormField>

      {/* Chapters */}
      <MagicalFormField
        label="Combien de chapitres veux-tu?"
        icon={<Layers size={20} color="#F59E0B" />}
        error={errors.numberOfChapters?.message}
      >
        <Slider name="numberOfChapters" control={control} text="chapitres" min={1} max={5} defaultValue={[1]} />
      </MagicalFormField>

      {/* Language */}
      <MagicalFormField
        label="Dans quelle langue?"
        icon={<BookOpen size={20} color="#6366F1" />}
        error={errors.language?.message}
      >
        <Select
          control={control}
          name="language"
          placeholder="Choisis ta langue"
          items={Object.entries(ALLOWED_LANGUAGES).map(([key, value]) => ({ key, value }))}
        />
      </MagicalFormField>

      {/* Submit Button */}
      <Box alignItems="center" marginTop="xl" marginBottom="l">
        <MagicalButton
          title={mutation.isPending ? "Création en cours..." : "Créer mon Histoire"}
          subtitle={mutation.isPending ? "La magie opère..." : "Prêt pour l'aventure?"}
          onPress={handleSubmit(onSubmit)}
          size="large"
          icon={<BookOpen size={24} color="white" />}
        />
      </Box>
    </Box>
  );
}