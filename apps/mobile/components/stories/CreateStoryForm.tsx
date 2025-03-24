import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALLOWED_LANGUAGES, createStory, THEMES, type CreateStoryFormData } from "@/api/stories";
import { Dimensions, ScrollView } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "../ui/Box";
import TextInput from "../ui/TextInput";
import { Baby, BookOpen, Film, Layers, User } from "lucide-react-native";
import Text from "../ui/Text";

import { useTheme } from "@shopify/restyle";
import { Theme } from "@/config/theme";
import Slider from "../ui/Slider";
import Button from "../ui/Button";
import Select from "../ui/Select";

const schema = z.object({
  title: z.string().min(3),
  synopsis: z.string().min(3),
  theme: z.string().min(3),
  protagonist: z.string().min(3),
  childAge: z.number().min(3),
  numberOfChapters: z.number().min(5),
  language: z.enum(['FR', 'EN', 'LI']),
});
const { width } = Dimensions.get('window');
const WIDTH = width * 0.8;
const TEXT_AREA_LIMIT = 4;

export const CreatStoryForm = () => {
  const theme = useTheme<Theme>();
  const token = useAuthStore((state) => state.token!);
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: CreateStoryFormData) => createStory({ ...data, token }),
    onSuccess: () => {
      alert('Story created');
    }
  })

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Omit<CreateStoryFormData, 'token'>>({
    defaultValues: {
      title: '',
      synopsis: '',
      theme: '',
      protagonist: '',
      childAge: 3,
      numberOfChapters: 5,
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
    <ScrollView style={{ width: 'auto', gap: 20, padding: 20 }}>
      <Box gap={"xl"}>
        {/* Title */}
        <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
          <TextInput name="title" placeholder="Title of the book" control={control} Icon={BookOpen} />
          {errors.title && <Text variant="formError" color="error">{errors.title.message}</Text>}
        </Box>

        {/* Protagonist */}
        <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
          <TextInput name="protagonist" placeholder="Name of the protagonist" control={control} Icon={User} />
          {errors.protagonist && <Text variant="formError" color="error">{errors.protagonist.message}</Text>}
        </Box>

        {/* Synopsis */}
        <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
          <TextInput name="synopsis" placeholder="Synopsis" control={control} Icon={Film} multiline numberOfLines={TEXT_AREA_LIMIT} />
          {errors.synopsis && <Text variant="formError" color="error">{errors.synopsis.message}</Text>}
        </Box>

        {/* Child age */}
        <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
          <Box flexDirection={"row"} gap={"s"} alignItems="center">
            <Baby color={theme.colors.primaryCardBackground} />
            <Text>Child age</Text>
          </Box>
          <Slider name="childAge" control={control} text="years old" />
          {errors.childAge && <Text variant="formError" color="error">{errors.childAge.message}</Text>}
        </Box>

        {/* Chapters */}
        <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
          <Box flexDirection={"row"} gap={"s"} alignItems="center">
            <Layers color={theme.colors.primaryCardBackground} />
            <Text>Number of chapters</Text>
          </Box>
          <Slider name="numberOfChapters" control={control} text="chapters" />
          {errors.numberOfChapters && <Text variant="formError" color="error">{errors.numberOfChapters.message}</Text>}
        </Box>

        {/* Language */}
        <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
          <Text variant={"body"}>Language</Text>
          <Select
            control={control}
            name="language"
            placeholder="Languages"
            items={Object.entries(ALLOWED_LANGUAGES).map(([key, value]) => ({ key, value }))}
          />
          {errors.language && <Text variant="formError" color="error">{errors.language.message}</Text>}
        </Box>

        {/* Themes */}
        <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
          <Text variant={"body"}>Themes</Text>
          <Select
            control={control}
            name="theme"
            placeholder="Themes"
            items={THEMES.map((theme) => ({ key: theme.value, value: theme.label }))}
          />
          {errors.theme && <Text variant="formError" color="error">{errors.theme.message}</Text>}
        </Box>
        <Box justifyContent="center" alignItems="center" width={WIDTH}>
          <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting} label={mutation.isPending ? "Processing..." : "Add a story"} />
        </Box>
      </Box>
    </ScrollView>
  );
}