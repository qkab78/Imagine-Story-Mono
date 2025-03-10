import React, { useCallback } from 'react'
import { Stories } from '@imagine-story/api/types/db'
import { Card, Image, Text, YStack } from 'tamagui'
import { Link, useRouter } from 'expo-router'

type StoryCardProps = { story: Pick<Stories, 'id' | 'slug' | 'title' | 'synopsis' | 'cover_image'> }

const StoryCard = (props: StoryCardProps) => {
  const router = useRouter()

  const { story } = props
  const { title, cover_image, slug } = story

  const gotToStoryPage = useCallback(() => router.push({
    pathname: '/(tabs)/stories/[slug]',
    params: { slug },
  }), [router, slug])

  return (
    <Card
      width={150}
      height={300}
      scale={0.9}
      hoverStyle={{ scale: 0.95 }}
      pressStyle={{ scale: 0.95 }}
      onPress={gotToStoryPage}
    >
      <Card.Header padding={0}>
        <Image
          objectFit='cover'
          alignSelf='center'
          source={{
            width: 150,
            height: 250,
            uri: cover_image
          }}
          borderRadius={5}
        />
      </Card.Header>
      <Card.Footer>
        <YStack>
          <Text fontSize={15} fontWeight={'600'}>{title}</Text>
        </YStack>
      </Card.Footer>
    </Card>
  )
}

export default StoryCard