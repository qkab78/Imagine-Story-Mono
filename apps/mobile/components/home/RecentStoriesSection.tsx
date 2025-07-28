import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { View, Text, FlatList } from 'react-native';
import StoryItem from './StoryItem';
import type { RecentStoriesSectionProps } from '@/types/home';
import { Stories } from '@imagine-story/api/types/db';

const RecentStoriesSection: React.FC<RecentStoriesSectionProps> = ({
  stories,
  onStoryPress,
  onStoryLongPress,
  isLoading = false,
}) => {
  const renderStoryItem = ({ item }: { item: Stories }) => (
    <StoryItem
      story={item}
      onPress={onStoryPress}
      onLongPress={onStoryLongPress}
    />
  );

  const keyExtractor = (item: Stories) => String(item.id);

  if (stories.length === 0 && !isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>✨ Histoires récentes</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Aucune histoire pour le moment
          </Text>
          <Text style={styles.emptySubtext}>
            Crée ta première histoire magique !
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Histoires récentes</Text>
      </View>
      
      <View style={styles.listContainer}>
        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  listContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,193,7,0.2)',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,193,7,0.2)',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#616161',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    textAlign: 'center',
  },
});

export default RecentStoriesSection;