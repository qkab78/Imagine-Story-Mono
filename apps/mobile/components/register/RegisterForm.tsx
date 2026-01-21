import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth/authStore";
import { register, RegisterFormData } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import Box from "../ui/Box";
import Text from "../ui/Text";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../ui/TextInput";
import { Link, useRouter } from "expo-router";
import { TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from "react";
import { useMMKVString } from "react-native-mmkv";


const schema = z.object({
  email: z.string().email("⚠️ Email invalide"),
  password: z.string().min(6, "⚠️ Au moins 6 caractères requis"),
  firstname: z.string().min(3, "⚠️ Au moins 3 caractères requis"),
  lastname: z.string().min(3, "⚠️ Au moins 3 caractères requis"),
});

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setToken, setUser } = useAuthStore((state) => state);
  const [, setUserToken] = useMMKVString('user.token');
  const router = useRouter();
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => register(data),
    onSuccess: (data) => {
      if (!data.token) {
        alert("User not created");
      }
      setToken(data.token);
      setUser(data.user);
      setUserToken(data.token);
      router.push("/");
    },
    onError: (error) => {
      alert(error.message);
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  })

  const { control, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<RegisterFormData & { confirmPassword: string }>({
    defaultValues: {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      confirmPassword: '',
    },
    resolver: zodResolver(schema.extend({
      confirmPassword: z.string().min(6, "⚠️ Au moins 6 caractères requis")
    }).refine((data) => data.password === data.confirmPassword, {
      message: "⚠️ Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    })),
    mode: "onBlur"
  });

  const onSubmit = async (data: RegisterFormData & { confirmPassword: string }) => {
    const { confirmPassword, ...submitData } = data;
    mutation.mutate(submitData);
  };


  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
      <Box justifyContent="center" alignItems="center" gap={"m"} width={300}>
        <Box gap={"s"} width="100%">
          <Box
            backgroundColor="white"
            borderRadius="l"
            paddingHorizontal="m"
            paddingVertical="m"
            style={{
              borderWidth: 2,
              borderColor: errors.firstname ? '#F44336' : 'rgba(255,193,7,0.3)',
              shadowColor: '#FF6B9D',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <TextInput
              name="firstname"
              placeholder="Prénom"
              control={control}
              style={{ fontSize: 16, color: '#424242' }}
              Icon={User}
            />
          </Box>
          {errors.firstname && (
            <Text variant="formError" color="error" paddingLeft="m" fontSize={14}>
              {errors.firstname.message}
            </Text>
          )}
        </Box>

        <Box gap={"s"} width="100%">
          <Box
            backgroundColor="white"
            borderRadius="l"
            paddingHorizontal="m"
            paddingVertical="m"
            style={{
              borderWidth: 2,
              borderColor: errors.lastname ? '#F44336' : 'rgba(255,193,7,0.3)',
              shadowColor: '#FF6B9D',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <TextInput
              name="lastname"
              placeholder="Nom de famille"
              control={control}
              style={{ fontSize: 16, color: '#424242' }}
              Icon={User}
            />
          </Box>
          {errors.lastname && (
            <Text variant="formError" color="error" paddingLeft="m" fontSize={14}>
              {errors.lastname.message}
            </Text>
          )}
        </Box>

        <Box gap={"s"} width="100%">
          <Box
            backgroundColor="white"
            borderRadius="l"
            paddingHorizontal="m"
            paddingVertical="m"
            style={{
              borderWidth: 2,
              borderColor: errors.email ? '#F44336' : 'rgba(255,193,7,0.3)',
              shadowColor: '#FF6B9D',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <TextInput
              name="email"
              placeholder="Email"
              control={control}
              style={{ fontSize: 16, color: '#424242' }}
              Icon={Mail}
            />
          </Box>
          {errors.email && (
            <Text variant="formError" color="error" paddingLeft="m" fontSize={14}>
              {errors.email.message}
            </Text>
          )}
        </Box>

        <Box gap={"s"} width="100%">
          <Box
            backgroundColor="white"
            borderRadius="l"
            paddingHorizontal="m"
            paddingVertical="m"
            flexDirection="row"
            alignItems="center"
            style={{
              borderWidth: 2,
              borderColor: errors.password ? '#F44336' : 'rgba(255,193,7,0.3)',
              shadowColor: '#FF6B9D',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <Box flex={1}>
              <TextInput
                name="password"
                placeholder="Mot de passe sécurisé"
                control={control}
                showPassword={showPassword}
                style={{ fontSize: 16, color: '#424242' }}
                Icon={Lock}
              />
            </Box>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ paddingLeft: 12 }}
            >
              {showPassword ?
                <EyeOff size={20} color="#FF6B9D" /> :
                <Eye size={20} color="#FF6B9D" />
              }
            </TouchableOpacity>
          </Box>
          {errors.password && (
            <Text variant="formError" color="error" paddingLeft="m" fontSize={14}>
              {errors.password.message}
            </Text>
          )}
        </Box>

        <Box gap={"s"} width="100%">
          <Box
            backgroundColor="white"
            borderRadius="l"
            paddingHorizontal="m"
            paddingVertical="m"
            flexDirection="row"
            alignItems="center"
            style={{
              borderWidth: 2,
              borderColor: errors.confirmPassword ? '#F44336' : 'rgba(255,193,7,0.3)',
              shadowColor: '#FF6B9D',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <Box flex={1}>
              <TextInput
                name="confirmPassword"
                placeholder="Confirme ton mot de passe"
                control={control}
                showPassword={showConfirmPassword}
                style={{ fontSize: 16, color: '#424242' }}
                Icon={Lock}
              />
            </Box>
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ paddingLeft: 12 }}
            >
              {showConfirmPassword ?
                <EyeOff size={20} color="#FF6B9D" /> :
                <Eye size={20} color="#FF6B9D" />
              }
            </TouchableOpacity>
          </Box>
          {errors.confirmPassword && (
            <Text variant="formError" color="error" paddingLeft="m" fontSize={14}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </Box>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting || mutation.isPending}
          style={{ width: '100%', marginTop: 20 }}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FFB74D']}
            style={{
              paddingVertical: 18,
              paddingHorizontal: 32,
              borderRadius: 25,
              alignItems: 'center',
              minHeight: 54,
              justifyContent: 'center',
              shadowColor: '#FF6B9D',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
            }}
          >
            <Text
              variant="buttonLabel"
              color="white"
              fontSize={17}
              fontWeight="700"
            >
              {mutation.isPending ? "Création..." : "Créer mon compte ✨"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 16, padding: 12 }}>
          <Text variant="body" color="primaryPink" fontSize={16} fontWeight="600" textAlign="center">
            <Link href={"/login"} asChild>
              <Text>Déjà un compte ? Se connecter</Text>
            </Link>
          </Text>
        </TouchableOpacity>
      </Box>
    </Animated.View>
  );
}