import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, AuthButton } from '@/components/molecules/auth';

const signupSchema = z.object({
  firstName: z.string()
    .min(1, 'Ce champ est obligatoire ⚠️')
    .min(2, 'Le prénom doit avoir au moins 2 caractères ✏️'),
  lastName: z.string()
    .min(1, 'Ce champ est obligatoire ⚠️')
    .min(2, 'Le nom doit avoir au moins 2 caractères ✏️'),
  email: z.string()
    .min(1, 'Ce champ est obligatoire ⚠️')
    .email("Oups ! Cet email n'a pas l'air correct 📧"),
  password: z.string()
    .min(1, 'Ce champ est obligatoire ⚠️')
    .min(6, 'Ton mot de passe doit avoir au moins 6 caractères 🔐')
    .regex(/[A-Z]/, 'Ton mot de passe doit contenir une majuscule 🔠')
    .regex(/[0-9]/, 'Ton mot de passe doit contenir un chiffre 🔢'),
  passwordConfirm: z.string()
    .min(1, 'Ce champ est obligatoire ⚠️'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Les mots de passe ne correspondent pas 🤔',
  path: ['passwordConfirm'],
});

export type SignupData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit: (data: SignupData) => void;
  loading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

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
                placeholder="Prénom"
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
                placeholder="Nom"
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
            placeholder="Email"
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
            placeholder="Mot de passe sécurisé"
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
            placeholder="Confirme ton mot de passe"
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
        title="Créer mon compte"
        emoji="✨"
        onPress={handleSubmit(onSubmit)}
        variant="signup"
        loading={loading}
        compact
      />
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
