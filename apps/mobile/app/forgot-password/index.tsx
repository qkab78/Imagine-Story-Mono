import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthHeader } from '@/components/molecules/auth';
import { TextInput, AuthButton } from '@/components/molecules/auth';
import { forgotPassword } from '@/api/auth';
import { useAppTranslation } from '@/hooks/useAppTranslation';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { t } = useAppTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const schema = z.object({
    email: z.string().min(1, t('validation.required')).email(t('validation.invalidEmail')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      await forgotPassword(data.email);
      setEmailSent(true);
    } catch {
      Alert.alert(t('forgotPassword.errorTitle'), t('forgotPassword.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#FFF8F0', '#FFE5E5']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {emailSent ? (
              <View style={styles.successContainer}>
                <AuthHeader
                  icon="📬"
                  title={t('forgotPassword.successTitle')}
                  subtitle={t('forgotPassword.successMessage')}
                  variant="default"
                />
                <View style={styles.formContainer}>
                  <AuthButton
                    title={t('forgotPassword.backToLogin')}
                    onPress={() => router.back()}
                    variant="primary"
                  />
                </View>
              </View>
            ) : (
              <>
                <AuthHeader
                  icon="🔑"
                  title={t('forgotPassword.title')}
                  subtitle={t('forgotPassword.subtitle')}
                  variant="default"
                />

                <View style={styles.formContainer}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        icon="✉️"
                        placeholder={t('forgotPassword.emailPlaceholder')}
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

                  <AuthButton
                    title={t('forgotPassword.submitButton')}
                    onPress={handleSubmit(onSubmit)}
                    variant="primary"
                    loading={isLoading}
                  />

                  <Text
                    style={styles.backLink}
                    onPress={() => router.back()}
                  >
                    {t('forgotPassword.backToLogin')}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 100,
    paddingBottom: 32,
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  backLink: {
    color: '#2F6B4F',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ForgotPasswordScreen;
