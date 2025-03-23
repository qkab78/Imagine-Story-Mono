import { Control, useController, useForm } from "react-hook-form";
import { Button, TextInput as RNTextInput } from "react-native";
import useAuthStore from "@/store/auth/authStore";
import { login, LoginFormData } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import Box from "../ui/Box";
import Text from "../ui/Text";
import { Check, Lock, LucideIcon, Mail, X } from "lucide-react-native";
import { useTheme } from "@shopify/restyle";
import { theme, Theme } from "@/config/theme";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormInputProps {
  name: "password" | "email",
  placeholder: string,
  control: Control<LoginFormData>,
  Icon: LucideIcon
  hasError?: boolean
  password?: boolean

}
const SIZE = theme.borderRadii.m * 2;
const ICON_SIZE = SIZE * .75;
const HEIGHT = SIZE * 2.5;
const WIDTH = 300;

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const TextInput = ({ name, control, Icon, hasError, placeholder }: LoginFormInputProps) => {
  const theme = useTheme<Theme>();
  const { field, fieldState } = useController({ name, control });
  const { onChange, onBlur, value } = field
  const { isTouched, invalid } = fieldState;

  const borderColor = !isTouched ? "primaryCardBackground" : invalid ? "error" : "success";
  const color = theme.colors[borderColor];

  return (
    <Box height={HEIGHT} width={WIDTH} flexDirection="row" justifyContent="space-between" padding={"s"} alignItems="center" gap={"s"} borderColor={borderColor} borderWidth={1} borderRadius={"m"}>
      <Box flexDirection={"row"} gap={"s"} alignItems="center" width={WIDTH * .75}>
        <Icon color={color} />
        <RNTextInput
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          secureTextEntry={name === "password"}
          underlineColorAndroid="transparent"
          placeholderTextColor={color}
        />
      </Box>
      {isTouched && (
        <Box height={SIZE} width={SIZE} justifyContent="center" alignItems="center" borderColor={hasError ? "error" : "success"} borderWidth={1} borderRadius={"m"}>
          {isTouched && invalid ? (
            <X color={theme.colors.error} size={ICON_SIZE} />
          ) : (
            <Check color={theme.colors.success} size={ICON_SIZE} />
          )}
        </Box>
      )}
    </Box>
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
    resolver: zodResolver(schema),
    mode: "onBlur"
  });

  const onSubmit = async (data: LoginFormData) => {
    mutation.mutate(data);
  };


  return (
    <Box justifyContent="center" alignItems="center" backgroundColor="mainBackground" gap={"m"}>
      <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
        <TextInput name="email" placeholder="Enter your email" control={control} Icon={Mail} hasError={!!errors.email} />
        {errors.email && <Text variant="form-error" color="error">{errors.email.message}</Text>}
      </Box>
      <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
        <TextInput name="password" placeholder="Enter your password" control={control} Icon={Lock} hasError={!!errors.password} />
        {errors.password && <Text variant="form-error" color="error">{errors.password.message}</Text>}
      </Box>

      <Button title={mutation.isPending ? "Login in..." : "Login"} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
    </Box>
  );
}