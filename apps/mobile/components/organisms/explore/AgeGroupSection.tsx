import { View, StyleSheet } from 'react-native';
import { SectionTitle, AgeGroupCard } from '@/components/atoms/explore';
import useExploreStore from '@/store/explore/exploreStore';
import { AGE_GROUPS, EXPLORE_SPACING } from '@/constants/explore';

interface AgeGroupSectionProps {
  onAgeGroupPress?: (ageGroupId: string) => void;
}

export const AgeGroupSection: React.FC<AgeGroupSectionProps> = ({
  onAgeGroupPress,
}) => {
  const { selectedAgeGroup, setSelectedAgeGroup } = useExploreStore();

  const handlePress = (ageGroupId: string) => {
    const newValue = selectedAgeGroup === ageGroupId ? null : ageGroupId;
    setSelectedAgeGroup(newValue);
    onAgeGroupPress?.(ageGroupId);
  };

  return (
    <>
      <SectionTitle title="Par tranche d'âge" emoji="👶" />
      <View style={styles.container}>
        <View style={styles.row}>
          {AGE_GROUPS.map((ageGroup) => (
            <AgeGroupCard
              key={ageGroup.id}
              ageGroup={ageGroup}
              isSelected={selectedAgeGroup === ageGroup.id}
              onPress={() => handlePress(ageGroup.id)}
            />
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: EXPLORE_SPACING.xl,
    marginBottom: EXPLORE_SPACING.xxxl,
  },
  row: {
    flexDirection: 'row',
    gap: EXPLORE_SPACING.md,
  },
});

export default AgeGroupSection;
