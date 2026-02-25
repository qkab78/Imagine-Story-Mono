import * as SecureStore from 'expo-secure-store'
import { MMKV } from 'react-native-mmkv'
import { Platform } from 'react-native'

const TOKEN_KEY = 'auth_token'
const MMKV_TOKEN_KEY = 'user.token'

const storage = new MMKV()

/**
 * Secure token storage using expo-secure-store (iOS Keychain / Android Keystore).
 * Falls back to MMKV on web platform where SecureStore is not available.
 * Handles migration from MMKV to SecureStore on first use.
 */

async function migrateFromMmkv(): Promise<void> {
  const existingToken = storage.getString(MMKV_TOKEN_KEY)
  if (existingToken) {
    await SecureStore.setItemAsync(TOKEN_KEY, existingToken)
    storage.delete(MMKV_TOKEN_KEY)
  }
}

export async function getSecureToken(): Promise<string | undefined> {
  if (Platform.OS === 'web') {
    return storage.getString(MMKV_TOKEN_KEY) || undefined
  }

  // Attempt migration from MMKV if needed
  const mmkvToken = storage.getString(MMKV_TOKEN_KEY)
  if (mmkvToken) {
    await migrateFromMmkv()
  }

  const token = await SecureStore.getItemAsync(TOKEN_KEY)
  return token || undefined
}

export async function setSecureToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    storage.set(MMKV_TOKEN_KEY, token)
    return
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function deleteSecureToken(): Promise<void> {
  if (Platform.OS === 'web') {
    storage.delete(MMKV_TOKEN_KEY)
    return
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY)
  // Also clean up legacy MMKV key if it exists
  storage.delete(MMKV_TOKEN_KEY)
}

/**
 * Synchronous token getter for initial store hydration.
 * Uses MMKV as a fallback for the initial render before async migration completes.
 */
export function getTokenSync(): string | undefined {
  if (Platform.OS === 'web') {
    return storage.getString(MMKV_TOKEN_KEY) || undefined
  }
  // On native, we still check MMKV for the initial sync load
  // The async migration will move it to SecureStore on first access
  return storage.getString(MMKV_TOKEN_KEY) || undefined
}
