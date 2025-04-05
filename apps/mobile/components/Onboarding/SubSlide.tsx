import React from 'react'
import Box from '../ui/Box';
import Text from '../ui/Text';
import Button from '../ui/Button';


type SubSlideProps = {
  subTitle: string;
  onPress: () => void;
  isLast?: boolean;
}

const SubSlide = ({ subTitle, isLast, onPress }: SubSlideProps) => {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal={"l"} gap={"l"}>
      <Text variant="body" style={{ textAlign: "justify" }}>{subTitle}</Text>
      <Button backgroundColor={isLast ? "blue" : "lightGray"} textColor={isLast ? "white" : "textPrimary"} onPress={onPress} label={isLast ? "Get Started" : "Next"} />
    </Box>
  )
}

export default SubSlide