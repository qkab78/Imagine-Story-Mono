import React from 'react'
import { Stories } from '@imagine-story/api/types/db'
import { Card } from 'tamagui'
import { Link } from 'expo-router'
import Animated from 'react-native-reanimated'
import { Dimensions } from 'react-native'
import Text from '../ui/Text'
import Box from '../ui/Box'

type StoryCardProps = { story: Pick<Stories, 'id'| 'slug' | 'title' | 'synopsis' | 'cover_image'> }

const { width } = Dimensions.get('window')
const ITEM_WIDTH = width * 0.7

const StoryCard = (props: StoryCardProps) => {
  const { story } = props
  const { title, cover_image, slug, id } = story

  return (
    <Link href={`/(tabs)/stories/${slug}`} asChild>
      <Card
        width={ITEM_WIDTH}
        height={300}
        scale={0.9}
        hoverStyle={{ scale: 0.95 }}
        pressStyle={{ scale: 0.95 }}
        style={{ position: 'relative' }}
      >
        <Card.Header padding={0}>
          <Animated.Image
            style={{ objectFit: 'cover', alignSelf: 'center' }}
            source={{
              width: ITEM_WIDTH,
              height: 300,
              uri: cover_image
            }}
            borderRadius={5}
            sharedTransitionTag={String(id)}
          />
        </Card.Header>
        <Card.Footer style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }} padding={10}>
          <Box backgroundColor={"mainBackground"} padding={"m"} borderRadius={"s"} opacity={0.9} width={width * 0.6}>
            <Text variant={"subTitle"}>{title}</Text>
          </Box>
        </Card.Footer>
      </Card>
    </Link>
  )
}

export default StoryCard