import { useNavigate } from 'react-router';
import { defaultAuthCredentials } from 'app/config.ts';
import { useAuth } from 'app/providers/AuthProvider';
import { rootPaths } from 'app/routes/paths';
import LoginForm, { type LoginFormValues } from 'shared/components/sections/authentications/default/LoginForm';
import { useLoginUser } from '../../application/mutations';

const LoginPage = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { trigger: login } = useLoginUser();

  const handleLogin = async (data: LoginFormValues) => {
    const res = await login(data).catch((error) => {
      throw new Error((error as any)?.data?.message || (error as Error).message);
    });
    if (res) {
      setCurrentUser(res);
      navigate(rootPaths.root);
    }
  };

  return <LoginForm handleLogin={handleLogin} defaultCredential={defaultAuthCredentials} />;
};

export default LoginPage;
