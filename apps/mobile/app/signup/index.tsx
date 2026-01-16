import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AgeBadge } from '@/components/atoms/auth';
import { AuthHeader, AuthFooter } from '@/components/molecules/auth';
import { SignupForm, type SignupData } from '@/components/organisms/auth';
import { useRegister } from '@/hooks/useAuth';

const SignupScreen = () => {
  const router = useRouter();
  const registerMutation = useRegister();

  const handleSignup = (data: SignupData) => {
    registerMutation.mutate({
      fullname: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
    });
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#FFF8F0', '#FFE5E5']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <AgeBadge ageRange="3-8 ans" />

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
              title="Rejoins l'aventure ! ✨"
              subtitle="Crée ton compte pour sauvegarder tes histoires magiques"
              variant="signup"
              compact
            />

            <SignupForm onSubmit={handleSignup} loading={registerMutation.isPending} />

            <AuthFooter
              question="Déjà un compte ?"
              linkText="Se connecter"
              onLinkPress={handleLoginPress}
              compact
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
    paddingTop: 80,
    paddingBottom: 24,
  },
});

export default SignupScreen;
