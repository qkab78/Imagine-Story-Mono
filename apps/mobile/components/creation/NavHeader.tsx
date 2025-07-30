import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import Text from '@/components/ui/Text';
import { spacing } from '@/theme/spacing';

interface NavHeaderProps {
  onBack: () => void;
  title: string;
}

const NavHeader: React.FC<NavHeaderProps> = ({ onBack, title }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBack}
        activeOpacity={0.8}
        accessibilityLabel="Retour"
        accessibilityRole="button"
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: spacing.lg,
  },
  
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.cardBackground,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  
  backIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  
  title: {
    fontSize: 20,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  
  placeholder: {
    width: 44,
  },
});

export default NavHeader;