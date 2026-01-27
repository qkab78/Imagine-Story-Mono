import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, AuthButton, FormDivider } from '@/components/molecules/auth';
import { useAppTranslation } from '@/hooks/useAppTranslation';

// Schema will be created inside component to access translations
export type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

interface SignupFormProps {
  onSubmit: (data: SignupData) => void;
  onGoogleSignIn?: () => void;
  loading?: boolean;
  googleLoading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onGoogleSignIn,
  loading = false,
  googleLoading = false,
}) => {
  const { t } = useAppTranslation('auth');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Create schema with translations
  const signupSchema = React.useMemo(() => z.object({
    firstName: z.string()
      .min(1, t('validation.required'))
      .min(2, t('validation.nameTooShort')),
    lastName: z.string()
      .min(1, t('validation.required'))
      .min(2, t('validation.lastnameTooShort')),
    email: z.string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail')),
    password: z.string()
      .min(1, t('validation.required'))
      .min(6, t('validation.passwordTooShort'))
      .regex(/[A-Z]/, t('validation.passwordNeedsUppercase'))
      .regex(/[0-9]/, t('validation.passwordNeedsNumber')),
    passwordConfirm: z.string()
      .min(1, t('validation.required')),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: t('validation.passwordMismatch'),
    path: ['passwordConfirm'],
  }), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                icon="👤"
                placeholder={t('signup.firstnamePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                compact
                error={errors.firstName?.message}
              />
            )}
          />
        </View>

        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                icon="👤"
                placeholder={t('signup.lastnamePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                compact
                error={errors.lastName?.message}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            icon="✉️"
            placeholder={t('signup.emailPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            compact
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
            placeholder={t('signup.passwordPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            passwordVisible={passwordVisible}
            onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
            compact
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="passwordConfirm"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            icon="🔒"
            placeholder={t('signup.confirmPasswordPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            passwordVisible={confirmVisible}
            onPasswordToggle={() => setConfirmVisible(!confirmVisible)}
            compact
            error={errors.passwordConfirm?.message}
          />
        )}
      />

      <AuthButton
        title={t('signup.submitButton')}
        emoji="✨"
        onPress={handleSubmit(onSubmit)}
        variant="signup"
        loading={loading}
        compact
      />

      {onGoogleSignIn && (
        <>
          <FormDivider />
          <AuthButton
            title={t('signup.googleButton')}
            onPress={onGoogleSignIn}
            variant="google"
            loading={googleLoading}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
});

export default SignupForm;
