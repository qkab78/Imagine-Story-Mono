import { Control, Controller, useForm } from "react-hook-form";
import { Button, TextInput, View } from "react-native";
import { ThemedText } from "../ThemedText";
import useAuthStore from "@/store/auth/authStore";
import { login, LoginFormData } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

interface LoginFormInputProps { name: "password" | "email", control: Control<LoginFormData>, password?: boolean }

const Input = ({ name, control, password }: LoginFormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'white', borderRadius: 5, padding: 20, width: 300 }}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder={name}
          secureTextEntry={password}
        />
      )}
    />
  )
}

export const LoginForm = () => {
  const { setToken, setUser } = useAuthStore((state) => state);
  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: (data) => {
      if (!data.token) {
        alert('Invalid credentials');
      }
      setToken(data.token);
      setUser(data.user);
    }
  })

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    mutation.mutate(data);
  };


  return (
    <View style={{ width: 'auto', gap: 20 }}>
      <Input name="email" control={control} />
      {errors.email && <ThemedText>This is required.</ThemedText>}
      <Input name="password" control={control} password />
      {errors.password && <ThemedText>This is required.</ThemedText>}

      <Button title={mutation.isPending ? "Login in..." : "Login"} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
    </View>
  );
}