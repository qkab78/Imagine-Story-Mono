import { Dimensions, TouchableOpacity } from 'react-native'

import Box from '@/components/ui/Box'
import Text from '@/components/ui/Text'
import { Link } from 'expo-router'
import { Stories } from '@imagine-story/api/types/db'

type ActiveStoryProps = { story: Stories }
const { width, height } = Dimensions.get('window')
const ITEM_WIDTH = width * 0.8
const ITEM_HEIGHT = height * 0.20

const ActiveStory = ({ story }: ActiveStoryProps) => {
  return (
    <Box backgroundColor={"secondaryCardBackground"} borderRadius={"m"} opacity={0.9} width={ITEM_WIDTH} padding={"m"} justifyContent={"center"}>
      <Text variant={"subTitle"}>{story.title}</Text>
      <Box borderWidth={1} borderColor={"textSecondary"} borderRadius={"s"} padding={"m"} marginTop={"m"}>
        <Link href={`/(tabs)/stories/${story.slug}`} asChild>
          <TouchableOpacity style={{ width: "100%" }}>
            <Text variant={"buttonLabel"} textAlign={"center"}>Continue story</Text>
          </TouchableOpacity>
        </Link>
      </Box>
    </Box>
  )
}
export default ActiveStory