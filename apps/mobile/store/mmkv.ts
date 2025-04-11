import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'user-information-storage',
});

export const setToken = (token: string) => {
  storage.set('user.token', token);
};

export const getToken = () => {
  return storage.getString('user.token');
};