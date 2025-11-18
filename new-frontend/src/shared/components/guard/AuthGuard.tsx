import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import paths from 'app/routes/paths';

const AuthGurad = ({ children }: PropsWithChildren) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to={paths.authLogin} />;
};

export default AuthGurad;
