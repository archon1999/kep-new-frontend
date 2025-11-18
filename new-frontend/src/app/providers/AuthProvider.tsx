import { PropsWithChildren, use } from 'react';
import CurrentUserProvider, { AuthContext } from './auth-provider/CurrentUserProvider';

const AuthProvider = ({ children }: PropsWithChildren) => {
  return <CurrentUserProvider>{children}</CurrentUserProvider>;
};

export const useAuth = () => use(AuthContext);

export default AuthProvider;
