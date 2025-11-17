import { PropsWithChildren, createContext, use, useCallback, useState } from 'react';
import { removeItemFromStore } from 'shared/lib/utils';
import { firebaseAuth } from 'shared/services/firebase/firebase';
import { User } from 'shared/services/swr/api-hooks/useAuthApi';

interface SessionUser extends User {
  provider?: string;
}

interface AuthFirebaseContextInterface {
  sessionUser: SessionUser | null;
  setSession: (user: SessionUser | null) => void;
  signout: () => void;
}

export const AuthFirebaseContext = createContext({} as AuthFirebaseContextInterface);

const AuthFirebaseProvider = ({ children }: PropsWithChildren) => {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  const setSession = useCallback(
    (user: User | null) => {
      setSessionUser(user);
    },
    [setSessionUser],
  );

  const signout = useCallback(() => {
    setSessionUser(null);
    removeItemFromStore('session_user');
    firebaseAuth.signOut();
  }, [setSessionUser]);

  return (
    <AuthFirebaseContext value={{ sessionUser, setSession, signout }}>
      {children}
    </AuthFirebaseContext>
  );
};

export const useAuth = () => use(AuthFirebaseContext);

export default AuthFirebaseProvider;
