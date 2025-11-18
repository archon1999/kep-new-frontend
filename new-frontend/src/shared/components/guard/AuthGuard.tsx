import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { authPaths } from 'app/routes/paths';

const AuthGurad = ({ children }: PropsWithChildren) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to={authPaths.login} />;
};

export default AuthGurad;
