import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth/authStore";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../ui/Input";
import { ALLOWED_LANGUAGES, createStory, THEMES, type CreateStoryFormData } from "@/api/stories";
import { Button, ScrollView, View } from "react-native";
import { Picker } from '@react-native-picker/picker'
import { useRef } from "react";



export const CreatStoryForm = () => {
  const pickerRef = useRef<Picker<string> | null>(null);
  const languagePickerRef = useRef<Picker<keyof typeof ALLOWED_LANGUAGES> | null>(null);
  const token = useAuthStore((state) => state.token!);
  const mutation = useMutation({
    mutationFn: (data: CreateStoryFormData) => createStory({ ...data, token }),
    onSuccess: () => {
      alert('Story created');
    }
  })

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, getValues } = useForm<CreateStoryFormData>({
    defaultValues: {
      title: '',
      synopsis: '',
      theme: '',
      protagonist: '',
      childAge: 3,
      numberOfChapters: 5,
      language: 'FR',
    },
  });

  const onSubmit = async (data: CreateStoryFormData) => {
    mutation.mutate(data);
  };


  return (
    <ScrollView style={{ width: 'auto', gap: 20, padding: 20 }}>
      <Input textColor="black" name="title" control={control} editable />
      <Input textColor="black" name="protagonist" control={control} editable />
      <Input
        name="synopsis"
        control={control}
        editable
        multiline
        numberOfLines={12}
        textColor="black"
      />
      <Input textColor="black" name="childAge" control={control} editable keyboardType={"numeric"} />
      <Input textColor="black" name="numberOfChapters" control={control} editable />
      {/* Language */}
      <View style={{ width: 'auto' }}>
        <Picker
          ref={languagePickerRef}
          selectedValue={getValues('language')}
          onValueChange={(itemValue) => {
            setValue('language', itemValue)
          }}
        >
          {Object.entries(ALLOWED_LANGUAGES).map(([key, value]) => {
            return (
              <Picker.Item
                key={key}
                value={key}
                label={value}
              />
            )
          })}
        </Picker>
      </View>
      {/* Theme */}
      <View style={{ width: 'auto' }}>
        <Picker
          ref={pickerRef}
          selectedValue={getValues('theme')}
          onValueChange={(itemValue) => {
            console.log(itemValue);
            
            setValue('theme', itemValue)
          }}
        >
          {THEMES.map((theme) => {
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
    </ScrollView>
  );
}