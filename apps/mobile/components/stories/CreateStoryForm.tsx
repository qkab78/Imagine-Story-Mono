import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth/authStore";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../ui/Input";
import { createStory, type CreateStoryFormData } from "@/api/stories";
import { Button, View } from "react-native";
import { Picker } from '@react-native-picker/picker'
import { useRef } from "react";

export const CreatStoryForm = () => {
  const themes = [
    { id: 1, label: 'Fantaisie', value: 'fantasy' },
    { id: 2, label: 'Science-fiction', value: 'science-fiction' },
    { id: 3, label: 'Horreur', value: 'horror' },
    { id: 4, label: 'Romance', value: 'romance' },
    { id: 5, label: 'Historique', value: 'historical' },
    { id: 6, label: 'Policier', value: 'detective' },
    { id: 7, label: 'Thriller', value: 'thriller' },
    { id: 8, label: 'Aventure', value: 'adventure' },
    { id: 9, label: 'Drame', value: 'drama' },
    { id: 10, label: 'Comédie', value: 'comedy' },
    { id: 11, label: 'Biographie', value: 'biography' },
    { id: 12, label: 'Autobiographie', value: 'autobiography' },
    { id: 13, label: 'Documentaire', value: 'documentary' },
    { id: 14, label: 'Essai', value: 'essay' },
    { id: 15, label: 'Poésie', value: 'poetry' },
    { id: 16, label: 'Nouvelle', value: 'short-story' },
    { id: 17, label: 'Conte', value: 'fable' },
    { id: 18, label: 'Mythe', value: 'myth' },
    { id: 19, label: 'Légende', value: 'legend' },
  ];
  
  const pickerRef = useRef<Picker<string> | null>(null);
  const token = useAuthStore((state) => state.token!);
  const mutation = useMutation({
    mutationFn: (data: CreateStoryFormData) => createStory({ ...data, token }),
    onSuccess: (data) => {
      alert('Story created');
    }
  })

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, getValues } = useForm<CreateStoryFormData>({
    defaultValues: {
      title: '',
      synopsis: '',
      theme: themes[0].value,
    },
  });

  const onSubmit = async (data: CreateStoryFormData) => {
    mutation.mutate(data);
  };


  return (
    <View style={{ width: 'auto', gap: 20 }}>
      <Input name="title" control={control} editable />
      <Input
        name="synopsis"
        control={control}
        editable
        multiline
        numberOfLines={12}
      />
      <View>
        <Picker
          ref={pickerRef}
          selectedValue={getValues('theme')}
          onValueChange={(itemValue) => {
            setValue('theme', itemValue)
          }}
        >
          {themes.map((theme) => {
            return (
              <Picker.Item
                key={theme.id}
                value={theme.value}
                label={theme.label}
              />
            )
          })}
        </Picker>
      </View>
      <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting} title={mutation.isPending ? "Processing..." : "Add a story"} />
    </View>
  );
}