import { PropsWithChildren, use } from 'react';
import Auth0Provider, { Auth0Context } from './auth-provider/Auth0Provider';
import SocialAuthProvider from './auth-provider/SocialAuthProvider';

// import AuthFirebaseProvider, { AuthFirebaseContext } from './auth-provider/AuthFirebaseProvider';

const AuthMethodProvider = Auth0Provider;
const AuthMethodContext = Auth0Context;

// const AuthMethodProvider = AuthFirebaseProvider;
// const AuthMethodContext = AuthFirebaseContext;

const AuthProvider = ({ children }: PropsWithChildren) => {
  return (
    <AuthMethodProvider>
      <SocialAuthProvider>{children}</SocialAuthProvider>
    </AuthMethodProvider>
  );
};

export const useAuth = () => use(AuthMethodContext);

export default AuthProvider;
