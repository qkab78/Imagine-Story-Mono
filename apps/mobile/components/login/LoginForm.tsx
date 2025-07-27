import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth/authStore";
import { login, LoginFormData } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import Box from "../ui/Box";
import Text from "../ui/Text";
import { Lock, Mail, Eye, EyeOff } from "lucide-react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../ui/TextInput";
import { Link } from "expo-router";
import { TouchableOpacity, Animated } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from "react";

const schema = z.object({
  email: z.string().email("⚠️ Email invalide"),
  password: z.string().min(6, "⚠️ Au moins 6 caractères requis"),
});

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, setUser } = useAuthStore((state) => state);
  const [, setUserToken] = useMMKVString('user.token');
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  
  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: (data) => {
      if (!data.token) {
        alert('Invalid credentials');
      }
      setToken(data.token);
      setUser(data.user);
      setUserToken(data.token);
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
              borderColor: errors.email ? '#F44336' : 'rgba(255,193,7,0.3)',
              shadowColor: '#2196F3',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <TextInput 
              name="email" 
              placeholder="Ton email" 
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
              shadowColor: '#2196F3',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <Box flex={1}>
              <TextInput 
                name="password" 
                placeholder="Ton mot de passe" 
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
                <EyeOff size={20} color="#2196F3" /> : 
                <Eye size={20} color="#2196F3" />
              }
            </TouchableOpacity>
          </Box>
          {errors.password && (
            <Text variant="formError" color="error" paddingLeft="m" fontSize={14}>
              {errors.password.message}
            </Text>
          )}
        </Box>

        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 12 }}>
          <Text 
            variant="body" 
            color="textGray" 
            fontSize={14}
          >
            Mot de passe oublié ? 🤔
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)} 
          disabled={isSubmitting || mutation.isPending}
          style={{ width: '100%', marginTop: 20 }}
        >
          <LinearGradient
            colors={['#2196F3', '#03DAC6']}
            style={{
              paddingVertical: 18,
              paddingHorizontal: 32,
              borderRadius: 25,
              alignItems: 'center',
              minHeight: 54,
              justifyContent: 'center',
              shadowColor: '#2196F3',
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
              {mutation.isPending ? "Connexion..." : "Se connecter 🔐"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 16, padding: 12 }}>
          <Text variant="body" color="kidBlue" fontSize={16} fontWeight="600" textAlign="center">
            <Link href={"/register"} asChild>
              <Text>Pas encore de compte ? S'inscrire</Text>
            </Link>
          </Text>
        </TouchableOpacity>
      </Box>
    </Animated.View>
  );
}