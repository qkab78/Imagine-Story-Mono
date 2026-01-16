import { useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { InputIcon, PasswordToggle } from '@/components/atoms/auth';

interface AuthTextInputProps extends Omit<RNTextInputProps, 'style'> {
  icon: string;
  error?: string;
  compact?: boolean;
  onPasswordToggle?: () => void;
  passwordVisible?: boolean;
}

export const TextInput: React.FC<AuthTextInputProps> = ({
  icon,
  error,
  compact = false,
  secureTextEntry = false,
  onPasswordToggle,
  passwordVisible = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    compact ? styles.inputCompact : styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <RNTextInput
          {...props}
          style={inputStyle}
          placeholderTextColor="#8BA598"
          secureTextEntry={secureTextEntry && !passwordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <InputIcon emoji={icon} active={isFocused} compact={compact} />
        {secureTextEntry && onPasswordToggle && (
          <PasswordToggle
            visible={passwordVisible}
            onToggle={onPasswordToggle}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    paddingVertical: 18,
    paddingLeft: 56,
    paddingRight: 20,
    borderWidth: 2,
    borderColor: '#F6C177',
    borderRadius: 16,
    fontFamily: 'Nunito',
    fontSize: 16,
    color: '#1F3D2B',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputCompact: {
    width: '100%',
    paddingVertical: 14,
    paddingLeft: 48,
    paddingRight: 16,
    borderWidth: 2,
    borderColor: '#F6C177',
    borderRadius: 16,
    fontFamily: 'Nunito',
    fontSize: 15,
    color: '#1F3D2B',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputFocused: {
    borderColor: '#2F6B4F',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2F6B4F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Nunito',
    fontWeight: '600',
    color: '#FF6B6B',
    marginTop: 6,
    marginLeft: 4,
  },
});

export default TextInput;
