
import React from 'react'
import { Stories } from '@imagine-story/api/types/db'
import StoryCard from './StoryCard'
import { Marquee } from '@animatereactnative/marquee'
import Box from '../ui/Box'

type StoryListProps = { stories: Stories[] }

const StoryList = (props: StoryListProps) => {
  const { stories } = props

  return (
    <Marquee spacing={20} speed={1}>
      <Box flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"} gap={"m"} paddingVertical={"m"}>
        {stories.map((story) => (
          <StoryCard key={String(story.id)} story={story} />
        ))}
      </Box>
    </Marquee>
  )
}

export default StoryList