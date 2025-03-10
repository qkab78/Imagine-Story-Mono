import React from 'react'
import { Stories } from '@imagine-story/api/types/db'
import { Card, Text, YStack } from 'tamagui'
import { Link } from 'expo-router'
import Animated from 'react-native-reanimated'

type StoryCardProps = { story: Pick<Stories, 'slug' | 'title' | 'synopsis' | 'cover_image'> }

const StoryCard = (props: StoryCardProps) => {
  const { story } = props
  const { title, cover_image, slug } = story

  return (
    <Link href={`/(tabs)/stories/${slug}`} asChild>
      <Card
        width={150}
        height={300}
        scale={0.9}
        hoverStyle={{ scale: 0.95 }}
        pressStyle={{ scale: 0.95 }}
      >
        <Card.Header padding={0}>
          <Animated.Image
            style={{ objectFit: 'cover', alignSelf: 'center' }}
            source={{
              width: 150,
              height: 250,
              uri: cover_image
            }}
            borderRadius={5}
            sharedTransitionTag={`story-image-${slug}`}
          />
        </Card.Header>
        <Card.Footer>
          <YStack>
            <Text fontSize={15} fontWeight={'600'}>{title}</Text>
          </YStack>
        </Card.Footer>
      </Card>
    </Link>
  )
}

export default StoryCard