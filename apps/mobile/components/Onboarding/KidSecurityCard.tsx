import React from 'react';
import { StyleSheet } from 'react-native';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { SecurityItem } from './kidSlides';
import { theme } from '@/config/theme';

interface KidSecurityCardProps {
  item: SecurityItem;
  index: number;
}

const KidSecurityCard: React.FC<KidSecurityCardProps> = ({ item, index }) => {
  return (
    <Box style={styles.card}>
      <Box 
        flexDirection="row" 
        alignItems="center" 
        gap="m"
        padding="m"
      >
        <Text style={styles.shieldIcon}>{item.icon}</Text>
        <Box flex={1}>
          <Text style={styles.itemText}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {' '}
            <Text style={styles.itemDescription}>{item.description}</Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F5E8',
    borderColor: theme.colors.safetyGreen,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 10,
  },
  shieldIcon: {
    color: theme.colors.safetyGreen,
    fontSize: 16,
  },
  itemText: {
    fontSize: 13,
    lineHeight: 18,
  },
  itemTitle: {
    color: theme.colors.textGreen,
    fontWeight: '600',
  },
  itemDescription: {
    color: theme.colors.textGray,
    fontWeight: '400',
  },
});

export default KidSecurityCard;