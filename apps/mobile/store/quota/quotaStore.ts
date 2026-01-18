import { create } from 'zustand'
import { MMKV } from 'react-native-mmkv'
import type { StoryQuotaDTO } from '../../api/stories/quotaTypes'

const quotaStorage = new MMKV({
  id: 'quota-storage',
})

export type QuotaState = {
  quota: StoryQuotaDTO | null
  lastFetched: number | null
}

export type QuotaActions = {
  setQuota: (quota: StoryQuotaDTO) => void
  decrementRemaining: () => void
  reset: () => void
  loadFromStorage: () => void
}

export type QuotaStore = QuotaState & QuotaActions

const STORAGE_KEY = 'story-quota'
const LAST_FETCHED_KEY = 'story-quota-last-fetched'

const loadQuota = (): StoryQuotaDTO | null => {
  try {
    const stored = quotaStorage.getString(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const saveQuota = (quota: StoryQuotaDTO) => {
  quotaStorage.set(STORAGE_KEY, JSON.stringify(quota))
}

const loadLastFetched = (): number | null => {
  try {
    const stored = quotaStorage.getNumber(LAST_FETCHED_KEY)
    return stored ?? null
  } catch {
    return null
  }
}

const saveLastFetched = (timestamp: number) => {
  quotaStorage.set(LAST_FETCHED_KEY, timestamp)
}

const clearStorage = () => {
  quotaStorage.delete(STORAGE_KEY)
  quotaStorage.delete(LAST_FETCHED_KEY)
}

const useQuotaStore = create<QuotaStore>((set, get) => ({
  quota: loadQuota(),
  lastFetched: loadLastFetched(),

  setQuota: (quota: StoryQuotaDTO) => {
    const now = Date.now()
    saveQuota(quota)
    saveLastFetched(now)
    set({ quota, lastFetched: now })
  },

  decrementRemaining: () => {
    const { quota } = get()
    if (!quota || quota.isUnlimited) return

    const newQuota: StoryQuotaDTO = {
      ...quota,
      storiesCreatedThisMonth: quota.storiesCreatedThisMonth + 1,
      remaining: quota.remaining !== null ? Math.max(0, quota.remaining - 1) : null,
      canCreate: quota.remaining !== null ? quota.remaining - 1 > 0 : true,
    }
    saveQuota(newQuota)
    set({ quota: newQuota })
  },

  reset: () => {
    clearStorage()
    set({
      quota: null,
      lastFetched: null,
    })
  },

  loadFromStorage: () => {
    set({
      quota: loadQuota(),
      lastFetched: loadLastFetched(),
    })
  },
}))

export default useQuotaStore
