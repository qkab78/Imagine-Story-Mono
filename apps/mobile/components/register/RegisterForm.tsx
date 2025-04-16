import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth/authStore";
import { register, RegisterFormData } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import Box from "../ui/Box";
import Text from "../ui/Text";
import { Lock, Mail } from "lucide-react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import { Link, useRouter } from "expo-router";
import { Dimensions } from "react-native";


const { width } = Dimensions.get("window")  

const WIDTH = width * 0.8;
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstname: z.string().min(3),
  lastname: z.string().min(3),
});



export const RegisterForm = () => {
  const { setToken, setUser } = useAuthStore((state) => state);
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => register(data),
    onSuccess: (data) => {
      if (!data.token) {
        alert("User not created");
      }
      setToken(data.token);
      setUser(data.user);
      router.push("/");
    },
    onError: (error) => {
      alert(error.message);
    }
  })

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
    },
    resolver: zodResolver(schema),
    mode: "onBlur"
  });

  const onSubmit = async (data: RegisterFormData) => {
    mutation.mutate(data);
  };


  return (
    <Box justifyContent="center" alignItems="center" gap={"m"}>
      <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
        <Text variant="buttonLabel">Firstname</Text>
        <TextInput name="firstname" placeholder="Enter your firstname" control={control} Icon={Mail} />
        {errors.firstname && <Text variant="formError" color="error">{errors.firstname.message}</Text>}
      </Box>

      <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
        <Text variant="buttonLabel">Lastname</Text>
        <TextInput name="lastname" placeholder="Enter your lastname" control={control} Icon={Mail} />
        {errors.lastname && <Text variant="formError" color="error">{errors.lastname.message}</Text>}
      </Box>

      <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
        <Text variant="buttonLabel">Email</Text>
        <TextInput name="email" placeholder="Enter your email" control={control} Icon={Mail} />
        {errors.email && <Text variant="formError" color="error">{errors.email.message}</Text>}
      </Box>

      <Box justifyContent="flex-start" alignItems="flex-start" gap={"s"} width={WIDTH}>
        <Text variant="buttonLabel">Password</Text>
        <TextInput name="password" placeholder="Enter your password" control={control} Icon={Lock} />
        {errors.password && <Text variant="formError" color="error">{errors.password.message}</Text>}
      </Box>

      <Box justifyContent="center" alignItems="center" width={WIDTH}>
        <Button bgColor="blue" textColor="black" label={mutation.isPending ? "Registering..." : "Register"} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
      </Box>
      <Box justifyContent="center" alignItems="center" width={WIDTH}>
        <Text variant="body" color="textPrimary">{"Already have an account? "}
          <Link href={"/login"} asChild>
            <Text variant="body" color="primary">Login</Text>
          </Link>
        </Text>
      </Box>
    </Box>
  );
}