import { useForm } from "react-hook-form";
import { Button } from "react-native";
import useAuthStore from "@/store/auth/authStore";
import { login, LoginFormData } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import Box from "../ui/Box";
import Text from "../ui/Text";
import { Lock, Mail } from "lucide-react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../ui/TextInput";

const WIDTH = 300;
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});



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