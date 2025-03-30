import React from 'react'
import { Stories } from '@imagine-story/api/types/db'
import { Card } from 'tamagui'
import { Link } from 'expo-router'
import Animated from 'react-native-reanimated'
import { Dimensions } from 'react-native'
import Text from '../ui/Text'
import Box from '../ui/Box'

type StoryCardProps = { story: Pick<Stories, 'id' | 'slug' | 'title' | 'synopsis' | 'cover_image'> }

const { width, height } = Dimensions.get('window')
const ITEM_WIDTH = width * 0.45
const ITEM_HEIGHT = height * 0.20

const StoryCard = (props: StoryCardProps) => {
  const { story } = props
  const { title, cover_image, slug, id } = story

  return (
    <Link href={`/(tabs)/stories/${slug}`} asChild>
      <Card
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
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
              height: ITEM_HEIGHT,
              uri: cover_image
            }}
            borderRadius={5}
            sharedTransitionTag={String(id)}
          />
        </Card.Header>
        <Card.Footer padding={10}>
          <Box
            backgroundColor={"mainBackground"}
            borderRadius={"s"}
            opacity={0.9}
          >
            <Text variant={"cardTitle"} numberOfLines={2}>{title}</Text>
          </Box>
        </Card.Footer>
      </Card>
    </Link>
  )
}

export default StoryCard