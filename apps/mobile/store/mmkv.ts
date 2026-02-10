import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'user-information-storage',
});

export const profileStorage = new MMKV({
  id: 'profile-information-storage',
});