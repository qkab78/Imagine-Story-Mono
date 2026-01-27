import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AgeBadge } from '@/components/atoms/auth';
import { AuthHeader, AuthFooter } from '@/components/molecules/auth';
import { LoginForm } from '@/components/organisms/auth';
import { useLogin, useGoogleSignIn } from '@/hooks/useAuth';
import { useAppTranslation } from '@/hooks/useAppTranslation';

const LoginScreen = () => {
  const router = useRouter();
  const { t } = useAppTranslation('auth');
  const loginMutation = useLogin();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn();

  const handleLogin = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  const handleForgotPassword = () => {
    Alert.alert(
      t('alerts.forgotPasswordTitle'),
      t('alerts.forgotPasswordMessage')
    );
  };

  const handleSignupPress = () => {
    router.push('/signup');
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#FFF8F0', '#FFE5E5']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <AgeBadge ageRange={t('ageBadge')} />

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
            <AuthHeader
              icon="✨"
              title={t('login.title')}
              subtitle={t('login.subtitle')}
              variant="default"
            />

            <LoginForm
              onSubmit={handleLogin}
              onGoogleSignIn={handleGoogleSignIn}
              onForgotPassword={handleForgotPassword}
              loading={loginMutation.isPending}
              googleLoading={isGoogleLoading}
            />

            <AuthFooter
              question={t('login.noAccount')}
              linkText={t('login.signupLink')}
              onLinkPress={handleSignupPress}
            />
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
});

export default LoginScreen;
