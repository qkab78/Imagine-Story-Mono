/**
 * useWidgetSync
 *
 * Automatically syncs the latest stories to iOS WidgetKit widgets
 * whenever the stories data changes.
 */

import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import type { StoryListItem } from '@/domain/stories/value-objects/StoryListItem'
import { syncStoriesToWidget } from '@/services/widget/widgetService'

/**
 * Syncs stories to the iOS widget extension via App Groups UserDefaults.
 * Call this hook with the latest stories array; it will sync to the widget
 * whenever the data changes.
 *
 * @param stories - Array of StoryListItem from useLatestStories()
 */
export function useWidgetSync(stories: StoryListItem[]): void {
  const lastSyncedRef = useRef<string>('')

  useEffect(() => {
    if (Platform.OS !== 'ios') return
    if (stories.length === 0) return

    // Simple fingerprint to avoid redundant syncs
    const fingerprint = stories
      .slice(0, 5)
      .map((s) => s.id.getValue())
      .join(',')

    if (fingerprint === lastSyncedRef.current) return
    lastSyncedRef.current = fingerprint

    syncStoriesToWidget(stories)
  }, [stories])
}
