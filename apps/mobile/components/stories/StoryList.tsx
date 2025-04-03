
import React from 'react'
import { Stories } from '@imagine-story/api/types/db'
import StoryCard from './StoryCard'
import { Marquee } from '@animatereactnative/marquee'
import Box from '../ui/Box'

type StoryListProps = { stories: Stories[], speed?: number }

const StoryList = (props: StoryListProps) => {
  const { stories, speed } = props

  return (
    <Marquee spacing={20} speed={speed ?? .7}>
      <Box flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"} gap={"m"} paddingVertical={"m"}>
        {stories.map((story) => (
          <StoryCard key={String(story.id)} story={story} />
        ))}
      </Box>
    </Marquee>
  )
}

export default StoryList