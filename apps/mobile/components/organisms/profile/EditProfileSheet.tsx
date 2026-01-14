import { useState } from 'react';
import {
  View,
  ScrollView,
  Modal,
  Pressable,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SheetHeader, FormInput, SectionTitle } from '@/components/atoms/profile';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile';

interface EditProfileSheetProps {
  visible: boolean;
  onClose: () => void;
  initialEmail: string;
  onSave: (data: { email: string; currentPassword?: string; newPassword?: string }) => void;
}

export const EditProfileSheet: React.FC<EditProfileSheetProps> = ({
  visible,
  onClose,
  initialEmail,
  onSave,
}) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erreur', 'Email invalide');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword && !currentPassword) {
      Alert.alert('Erreur', 'Veuillez entrer votre mot de passe actuel');
      return;
    }

    onSave({
      email: email.trim(),
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[PROFILE_COLORS.backgroundTop, PROFILE_COLORS.backgroundBottom]}
        style={styles.container}
      >
        <View style={{ paddingTop: insets.top }}>
          <SheetHeader title="Modifier mes informations" onBack={onClose} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + PROFILE_SPACING.xxl },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Email Section */}
            <View style={styles.section}>
              <SectionTitle>Email</SectionTitle>
              <View style={styles.card}>
                <FormInput
                  label="Adresse email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="votre@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Section */}
            <View style={styles.section}>
              <SectionTitle>Mot de passe</SectionTitle>
              <View style={styles.card}>
                <FormInput
                  label="Mot de passe actuel"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="••••••••"
                  secureTextEntry
                />
                <FormInput
                  label="Nouveau mot de passe"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="••••••••"
                  secureTextEntry
                />
                <FormInput
                  label="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Save Button */}
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    padding: PROFILE_SPACING.xl,
  },
  section: {
    marginBottom: PROFILE_SPACING.xl,
  },
  card: {
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: PROFILE_DIMENSIONS.cardBorderRadius,
    padding: PROFILE_SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: PROFILE_COLORS.primary,
    borderRadius: 12,
    paddingVertical: PROFILE_SPACING.lg,
    alignItems: 'center',
    shadowColor: PROFILE_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: 'white',
  },
});

export default EditProfileSheet;
