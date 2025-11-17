import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import paths from 'app/routes/paths';

const AuthGurad = ({ children }: PropsWithChildren) => {
  const { sessionUser } = useAuth();

  return sessionUser ? children : <Navigate to={paths.defaultJwtLogin} />;
};

export default AuthGurad;
