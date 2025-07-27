import React from 'react';
import { StyleSheet } from 'react-native';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { theme } from '@/config/theme';

interface AgeBadgeProps {
  ageRange?: string;
}

const AgeBadge: React.FC<AgeBadgeProps> = ({ ageRange = "3-8 ans" }) => {
  return (
    <Box style={styles.badge}>
      <Text style={styles.badgeText}>{ageRange}</Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 44,
    left: 24,
    backgroundColor: theme.colors.safetyGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
});

export default AgeBadge;