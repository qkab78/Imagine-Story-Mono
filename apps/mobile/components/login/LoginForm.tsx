import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth/authStore";
import { login, LoginFormData } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import Box from "../ui/Box";
import Text from "../ui/Text";
import { Lock, Mail } from "lucide-react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import { Link } from "expo-router";
import { Dimensions } from "react-native";
import { useMMKVString } from "react-native-mmkv";

const { width } = Dimensions.get("window")  

const WIDTH = width * 0.8;
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});



export const LoginForm = () => {
  const { setToken, setUser } = useAuthStore((state) => state);
  const [, setUserToken] = useMMKVString('user.token');
  
  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: (data) => {
      if (!data.token) {
        alert('Invalid credentials');
      }
      setToken(data.token);
      setUser(data.user);
      setUserToken(data.token);
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
    <Box justifyContent="center" alignItems="center" gap={"m"}>
      <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
        <Text variant="buttonLabel">Email</Text>
        <TextInput name="email" placeholder="Enter your email" control={control} Icon={Mail} hasError={!!errors.email} />
        {errors.email && <Text variant="formError" color="error">{errors.email.message}</Text>}
      </Box>
      <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
        <Text variant="buttonLabel">Password</Text>
        <TextInput name="password" placeholder="Enter your password" control={control} Icon={Lock} hasError={!!errors.password} />
        {errors.password && <Text variant="formError" color="error">{errors.password.message}</Text>}
      </Box>

      <Box justifyContent="center" alignItems="center" width={WIDTH}>
        <Button bgColor="blue" textColor="black" label={mutation.isPending ? "Login in..." : "Login"} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
      </Box>
      <Box justifyContent="center" alignItems="center" width={WIDTH}>
        <Text variant="body" color="textPrimary">{"Don't have an account? "}
          <Link href={"/register"} asChild>
            <Text variant="body" color="primary">Register</Text>
          </Link>
        </Text>
      </Box>
    </Box>
  );
}