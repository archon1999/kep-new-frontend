import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { initialConfig } from 'app/config.ts';
import Splash from 'shared/components/loading/Splash';
import { removeItemFromStore } from 'shared/lib/utils';
import { User, useGetCurrentUser, useLogOutUser } from 'shared/services/swr/api-hooks/useAuthApi';

interface AuthContextInterface {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  refreshCurrentUser: () => Promise<User | undefined>;
  signout: () => Promise<void>;
}

const avatar = (index: number) => `${initialConfig.assetsDir}/images/avatar/${index}.webp`;

export const demoUser: User = {
  id: 0,
  email: 'guest@mail.com',
  name: 'Guest',
  avatar: avatar(14),
  designation: 'Merchant Captain',
};

export const AuthContext = createContext({} as AuthContextInterface);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { data, isLoading, mutate } = useGetCurrentUser({
    suspense: false,
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { trigger: logoutUser } = useLogOutUser();

  useEffect(() => {
    if (data !== undefined) {
      setCurrentUser(data);
    }
  }, [data]);

  const refreshCurrentUser = useCallback(() => mutate(), [mutate]);

  const signout = useCallback(async () => {
    await logoutUser().catch(() => {});
    setCurrentUser(null);
    removeItemFromStore('current_user');
  }, [logoutUser]);

  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      refreshCurrentUser,
      signout,
    }),
    [currentUser, refreshCurrentUser, signout],
  );

  if (isLoading && !currentUser) {
    return <Splash />;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => use(AuthContext);

export default AuthProvider;
