/**
 * Widget Service
 *
 * Syncs story data to shared UserDefaults (App Groups) so that
 * iOS WidgetKit widgets can display the latest stories.
 */

import { Platform } from 'react-native'
import type { StoryListItem } from '@/domain/stories/value-objects/StoryListItem'
import { getStoryOfTheDay } from '@/api/stories/widgetApi'
import { StoryDTOMapper } from '@/features/stories/mappers/StoryDTOMapper'

/** Shared App Group identifier (must match widget entitlements). */
const GROUP_ID = process.env.EXPO_PUBLIC_WIDGET_GROUP_ID || 'group.com.qkab78.mobile.widget';
const STORIES_KEY = 'stories'
const STORY_OF_THE_DAY_KEY = 'storyOfTheDay'

/** Lightweight story shape written to UserDefaults. */
interface WidgetStoryData {
  id: string
  title: string
  synopsis: string
  themeKey: string
  themeName: string
  numberOfChapters: number
}

/**
 * Maps a StoryListItem to the lightweight WidgetStoryData shape.
 */
function toWidgetStoryData(story: StoryListItem): WidgetStoryData {
  return {
    id: story.id.getValue(),
    title: story.title,
    synopsis: story.synopsis,
    themeKey: story.theme.key,
    themeName: story.theme.name,
    numberOfChapters: story.numberOfChapters,
  }
}

/**
 * Syncs the given stories to the shared UserDefaults for widget consumption.
 * Only runs on iOS (widgets are an iOS-only feature).
 */
export async function syncStoriesToWidget(stories: StoryListItem[]): Promise<void> {
  if (Platform.OS !== 'ios') return

  try {
    const { ExtensionStorage } = await import('@bacons/apple-targets')
    const storage = new ExtensionStorage(GROUP_ID)

    const widgetStories: WidgetStoryData[] = stories.slice(0, 5).map(toWidgetStoryData)

    storage.set(STORIES_KEY, JSON.stringify(widgetStories))
    ExtensionStorage.reloadWidget()
  } catch (error) {
    // Silently fail — widget sync is non-critical
    console.warn('[WidgetService] Failed to sync stories to widget:', error)
  }
}

/**
 * Fetches the story of the day from the backend and syncs it to the widget.
 * Only runs on iOS (widgets are an iOS-only feature).
 */
export async function syncStoryOfTheDayToWidget(): Promise<void> {
  if (Platform.OS !== 'ios') return

  try {
    const dto = await getStoryOfTheDay()
    if (!dto) return

    const story = StoryDTOMapper.listItemToDomain(dto)

    const { ExtensionStorage } = await import('@bacons/apple-targets')
    const storage = new ExtensionStorage(GROUP_ID)

    storage.set(STORY_OF_THE_DAY_KEY, JSON.stringify(toWidgetStoryData(story)))
    ExtensionStorage.reloadWidget()
  } catch (error) {
    console.warn('[WidgetService] Failed to sync story of the day to widget:', error)
  }
}
