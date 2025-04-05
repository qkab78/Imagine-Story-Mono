import React from 'react'
import { SharedValue } from 'react-native-reanimated';
import Box from '../ui/Box';
import Text from '../ui/Text';
import Button from '../ui/Button';
type SubSlideProps = {
  subTitle: string;
  scrollX: SharedValue<number>;
  onPress: () => void;
  isLast?: boolean;
}

const SubSlide = ({ subTitle, scrollX, isLast, onPress }: SubSlideProps) => {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal={"l"} gap={"l"}>
      <Text variant="body" style={{ textAlign: "justify" }}>{subTitle}</Text>
      <Button backgroundColor={"lightGray"} textColor={isLast ? "white" : "textPrimary"} onPress={onPress} label={isLast ? "Get Started" : "Next"} />
    </Box>
  )
}

export default SubSlide