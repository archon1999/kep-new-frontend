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
import { Auth0Provider as ReactAuth0Provider, useAuth0 } from '@auth0/auth0-react';
import Splash from 'shared/components/loading/Splash';
import { removeItemFromStore } from 'shared/lib/utils';
import { firebaseAuth } from 'shared/services/firebase/firebase';
import { User } from 'shared/services/swr/api-hooks/useAuthApi';

interface SessionUser extends User {
  provider?: string;
}

interface Auth0ContextInterface {
  sessionUser: SessionUser | null;
  setSessionUser: Dispatch<SetStateAction<User | null>>;
  setSession: (user: SessionUser | null) => void;
  signout: () => void;
}

export const Auth0Context = createContext({} as Auth0ContextInterface);

const Auth0Provider = ({ children }: PropsWithChildren) => {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const { user, isLoading, logout } = useAuth0();

  const setSession = useCallback(
    (user: User | null) => {
      setSessionUser(user);
    },
    [setSessionUser],
  );

  const signout = useCallback(() => {
    removeItemFromStore('session_user');
    if (sessionUser?.provider === 'firebase') {
      setSessionUser(null);
      firebaseAuth.signOut();
    } else {
      logout();
    }
  }, [logout, sessionUser]);

  useEffect(() => {
    if (user) {
      setSession({
        id: user?.sub || '',
        name: user?.name || 'User',
        email: user?.email || '',
        avatar: user?.picture || '',
      });
    } else {
      setSessionUser(null);
    }
  }, [user]);

  return (
    <Auth0Context
      value={{
        sessionUser,
        setSession,
        setSessionUser,
        signout,
      }}
    >
      {isLoading ? <Splash /> : children}
    </Auth0Context>
  );
};

export const useAuth = () => use(Auth0Context);

export const index = ({ children }: PropsWithChildren) => {
  return (
    <ReactAuth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Auth0Provider>{children}</Auth0Provider>
    </ReactAuth0Provider>
  );
};

export default index;
