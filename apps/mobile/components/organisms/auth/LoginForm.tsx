import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextInput,
  AuthButton,
  FormDivider,
  ForgotPasswordLink,
} from '@/components/molecules/auth';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Ce champ est obligatoire ⚠️')
    .email("Oups ! Cet email n'a pas l'air correct 📧"),
  password: z.string()
    .min(1, 'Ce champ est obligatoire ⚠️'),
});

type LoginData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onGoogleSignIn: () => void;
  onForgotPassword: () => void;
  loading?: boolean;
  googleLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onGoogleSignIn,
  onForgotPassword,
  loading = false,
  googleLoading = false,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = (data: LoginData) => {
    onSubmit(data.email, data.password);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            icon="✉️"
            placeholder="Ton email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            icon="🔒"
            placeholder="Ton mot de passe"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            passwordVisible={passwordVisible}
            onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
            error={errors.password?.message}
          />
        )}
      />

      <ForgotPasswordLink onPress={onForgotPassword} />

      <AuthButton
        title="Se connecter"
        emoji="🔓"
        onPress={handleSubmit(handleFormSubmit)}
        variant="primary"
        loading={loading}
      />

      <FormDivider />

      <AuthButton
        title="Continuer avec Google"
        onPress={onGoogleSignIn}
        variant="google"
        loading={googleLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
});

export default LoginForm;
