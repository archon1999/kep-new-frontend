import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { users } from 'data/users';
import { removeItemFromStore } from 'shared/lib/utils';
import { User, useGetCurrentUser } from 'shared/services/swr/api-hooks/useAuthApi';

interface CurrentUser extends User {
  provider?: string;
}

interface AuthContextInterface {
  currentUser: CurrentUser | null;
  setCurrentUser: Dispatch<SetStateAction<CurrentUser | null>>;
  updateCurrentUser: (user: CurrentUser | null) => void;
  signout: () => void;
}

export const AuthContext = createContext({} as AuthContextInterface);

const CurrentUserProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const { data } = useGetCurrentUser();

  const updateCurrentUser = useCallback(
    (user: CurrentUser | null) => {
      setCurrentUser(user);
    },
    [setCurrentUser],
  );

  const signout = useCallback(() => {
    setCurrentUser(null);
    removeItemFromStore('current_user');
  }, []);

  useEffect(() => {
    if (data) {
      updateCurrentUser(data);
    }
  }, [data, updateCurrentUser]);

  return (
    <AuthContext value={{ currentUser, setCurrentUser, updateCurrentUser, signout }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => use(AuthContext);

export const demoUser: CurrentUser = {
  id: 0,
  email: 'guest@mail.com',
  name: 'Guest',
  avatar: users[13].avatar,
  designation: 'Merchant Captian ',
};

export default CurrentUserProvider;
