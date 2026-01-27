import React from 'react';
import { StyleSheet } from 'react-native';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { theme } from '@/config/theme';

const SafetyBanner: React.FC = () => {
  const { t } = useAppTranslation('common');

  return (
    <Box style={styles.container}>
      <Box style={styles.gradient}>
        <Box flexDirection="row" alignItems="center" justifyContent="center">
          <Text style={styles.icon}>🛡️</Text>
          <Text style={styles.text}>{t('onboarding.safetyBanner')}</Text>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 32,
  },
  gradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.safetyGreen,
    borderRadius: 20,
    shadowColor: theme.colors.safetyGreen,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
});

export default SafetyBanner;