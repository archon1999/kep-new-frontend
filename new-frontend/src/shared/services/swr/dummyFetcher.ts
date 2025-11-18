import { getItemFromStore, setItemToStore } from 'shared/lib/utils';
import { SessionUser } from './api-hooks/useAuthApi';

const testUser: SessionUser = {
  username: 'demo-user',
  email: 'demo@aurora.com',
  id: 1,
  firstName: 'Demo',
  lastName: 'User',
  type: 'test',
  avatar: null,
};

export const getProfileFetcher = (): Promise<SessionUser | null> =>
  new Promise((resolve) => {
    const user = getItemFromStore('session_user');
    if (user) {
      resolve(testUser);
    }
    resolve(null);
  });

export const loginFetcher = (): Promise<{ user: SessionUser }> =>
  new Promise((resolve) => {
    setTimeout(() => {
      setItemToStore('session_user', JSON.stringify(testUser));
      resolve({ user: testUser });
    }, 1000);
  });

export const sendPasswordResetLinkFetcher = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('success');
    }, 1000);
  });
