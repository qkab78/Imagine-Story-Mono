import { useState, useMemo } from 'react';
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
import { useAppTranslation } from '@/hooks/useAppTranslation';

type LoginData = {
  email: string;
  password: string;
};

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
  const { t } = useAppTranslation('auth');
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Schema de validation avec traductions
  const loginSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t('validation.required'))
          .email(t('validation.invalidEmail')),
        password: z.string().min(1, t('validation.required')),
      }),
    [t]
  );

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
            placeholder={t('login.emailPlaceholder')}
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
            placeholder={t('login.passwordPlaceholder')}
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
        title={t('login.submitButton')}
        emoji="🔓"
        onPress={handleSubmit(handleFormSubmit)}
        variant="primary"
        loading={loading}
      />

      <FormDivider />

      <AuthButton
        title={t('login.googleButton')}
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
